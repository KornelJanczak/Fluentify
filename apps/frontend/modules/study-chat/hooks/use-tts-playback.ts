"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Cartesia from "@cartesia/cartesia-js";

import { getAccessToken } from "@/modules/auth/api";
import { getCartesiaTTSToken } from "../api";

export type TTSPlaybackState = "idle" | "buffering" | "playing" | "error";

export type UseTTSPlaybackOptions = {
  /** Whether TTS is enabled by user preference */
  enabled: boolean;
  /** Cartesia Voice ID. Defaults to standard conversational tutor voice */
  voiceId?: string;
  /** Cartesia Model ID. Defaults to sonic-3 */
  modelId?: string;
  /** Callback fired with the completed WAV Blob when the TTS turn finishes receiving audio */
  onAudioComplete?: (blob: Blob) => void;
};

export type UseTTSPlaybackResult = {
  state: TTSPlaybackState;
  pushText: (text: string) => void;
  finish: () => void;
  cancel: () => void;
  error: string | null;
};

export const DEFAULT_CARTESIA_VOICE_ID = "f786b574-daa5-4673-aa0c-cbe3e8534c02";
export const DEFAULT_CARTESIA_MODEL_ID = "sonic-3";
const SAMPLE_RATE = 44100;

/**
 * Encode an array of PCM Float32 chunks as a standard WAV (IEEE float, mono).
 * The WAV header is 44 bytes; each sample is 4 bytes (little-endian float32).
 */
function encodeWav(chunks: Float32Array[], totalSamples: number, sampleRate: number): Blob {
  const dataBytes = totalSamples * 4;
  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  // RIFF chunk descriptor
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataBytes, true);
  writeStr(8, "WAVE");
  // fmt sub-chunk
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);             // sub-chunk size
  view.setUint16(20, 3, true);              // audio format: IEEE float
  view.setUint16(22, 1, true);              // mono
  view.setUint32(24, sampleRate, true);     // sample rate
  view.setUint32(28, sampleRate * 4, true); // byte rate
  view.setUint16(32, 4, true);              // block align
  view.setUint16(34, 32, true);             // bits per sample
  // data sub-chunk
  writeStr(36, "data");
  view.setUint32(40, dataBytes, true);
  let offset = 44;
  for (const chunk of chunks) {
    for (const sample of chunk) {
      view.setFloat32(offset, sample, true);
      offset += 4;
    }
  }
  return new Blob([buffer], { type: "audio/wav" });
}

function base64ToFloat32Array(base64: string): Float32Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Float32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 4);
}

export function useTTSPlayback({
  enabled,
  voiceId = DEFAULT_CARTESIA_VOICE_ID,
  modelId = DEFAULT_CARTESIA_MODEL_ID,
  onAudioComplete,
}: UseTTSPlaybackOptions): UseTTSPlaybackResult {
  const [state, setState] = useState<TTSPlaybackState>("idle");
  const [error, setError] = useState<string | null>(null);

  const onAudioCompleteRef = useRef(onAudioComplete);
  useEffect(() => {
    onAudioCompleteRef.current = onAudioComplete;
  }, [onAudioComplete]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wsRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contextRef = useRef<any>(null);
  const tokenCacheRef = useRef<{ token: string; expiresAt: number } | null>(null);
  const isReceivingRef = useRef<boolean>(false);
  // Accumulates raw PCM chunks for the current TTS turn so they can be encoded
  // as WAV and uploaded to storage after streaming completes.
  const recordedChunksRef = useRef<Float32Array[]>([]);

  // Promise queue to serialize connection, context initialization, and text chunks
  const pushQueueRef = useRef<Promise<void>>(Promise.resolve());
  const hasPushedTranscriptRef = useRef<boolean>(false);

  const getAudioContext = useCallback((): AudioContext => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      const AudioContextClass =
        window.AudioContext ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass({ sampleRate: SAMPLE_RATE });
      nextStartTimeRef.current = 0;
    }
    if (audioCtxRef.current.state === "suspended") {
      void audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const ensureToken = useCallback(async (): Promise<string> => {
    const now = Math.floor(Date.now() / 1000);
    if (tokenCacheRef.current && tokenCacheRef.current.expiresAt > now + 15) {
      return tokenCacheRef.current.token;
    }

    const authToken = getAccessToken();
    if (!authToken) {
      throw new Error("You must be logged in to use text-to-speech.");
    }

    const tokenData = await getCartesiaTTSToken(authToken);
    tokenCacheRef.current = {
      token: tokenData.access_token,
      expiresAt: tokenData.expires_at,
    };
    return tokenData.access_token;
  }, []);

  const stopAudio = useCallback(() => {
    for (const source of activeSourcesRef.current) {
      try {
        source.stop();
        source.disconnect();
      } catch {
        // Source might already have ended
      }
    }
    activeSourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  }, []);

  const cancel = useCallback(() => {
    stopAudio();
    pushQueueRef.current = Promise.resolve();
    hasPushedTranscriptRef.current = false;
    if (contextRef.current) {
      try {
        void contextRef.current.cancel();
      } catch {
        // Ignore cancel errors
      }
      contextRef.current = null;
    }
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // Ignore close errors
      }
      wsRef.current = null;
    }
    isReceivingRef.current = false;
    recordedChunksRef.current = [];
    setState("idle");
    setError(null);
  }, [stopAudio]);

  const schedulePlayback = useCallback(
    (floats: Float32Array) => {
      if (floats.length === 0) return;
      try {
        const audioCtx = getAudioContext();
        const buffer = audioCtx.createBuffer(1, floats.length, SAMPLE_RATE);
        buffer.getChannelData(0).set(floats);

        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        const startTime = Math.max(now, nextStartTimeRef.current);
        source.start(startTime);
        nextStartTimeRef.current = startTime + buffer.duration;

        activeSourcesRef.current.add(source);
        source.onended = () => {
          activeSourcesRef.current.delete(source);
          if (activeSourcesRef.current.size === 0 && !isReceivingRef.current) {
            setState("idle");
          }
        };

        setState("playing");
      } catch (playErr) {
        setError(playErr instanceof Error ? playErr.message : "Audio playback error");
        setState("error");
      }
    },
    [getAudioContext],
  );

  const startReceiving = useCallback(
    async (context: { receive: () => AsyncGenerator<unknown> }) => {
      isReceivingRef.current = true;
      try {
        for await (const event of context.receive()) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ev = event as any;
          if (ev && ev.type === "chunk") {
            let floatArray: Float32Array | null = null;
            if (typeof ev.data === "string") {
              floatArray = base64ToFloat32Array(ev.data);
            } else if (ev.audio instanceof Uint8Array || ev.audio?.buffer) {
              floatArray = new Float32Array(
                ev.audio.buffer,
                ev.audio.byteOffset,
                ev.audio.byteLength / 4,
              );
            }
            if (floatArray) {
              schedulePlayback(floatArray);
              recordedChunksRef.current.push(floatArray);
            }
          } else if (ev && ev.type === "error") {
            setError(ev.message || ev.title || "Cartesia TTS error");
            setState("error");
            break;
          }
        }
      } catch (receiveErr) {
        // Stream aborted or network error
        if (isReceivingRef.current) {
          setError(
            receiveErr instanceof Error ? receiveErr.message : "Audio stream interrupted",
          );
          setState("error");
        }
      } finally {
        isReceivingRef.current = false;
        if (activeSourcesRef.current.size === 0) {
          setState("idle");
        }

        // When the Cartesia WebSocket stream finishes sending all audio chunks
        // for this context, encode and notify the consumer (e.g. for S3 upload).
        const chunks = recordedChunksRef.current;
        if (chunks.length > 0) {
          const totalSamples = chunks.reduce((sum, c) => sum + c.length, 0);
          if (totalSamples > 0) {
            const wav = encodeWav(chunks, totalSamples, SAMPLE_RATE);
            recordedChunksRef.current = [];
            onAudioCompleteRef.current?.(wav);
          }
        }
      }
    },
    [schedulePlayback],
  );

  const pushText = useCallback(
    (text: string) => {
      if (!enabled || !text.trim()) return;

      pushQueueRef.current = pushQueueRef.current
        .then(async () => {
          if (!enabled) return;

          if (!wsRef.current) {
            setState("buffering");
            const token = await ensureToken();
            const client = new Cartesia({ apiKey: token });
            const ws = await client.tts.websocket();

            // Bind error callback to prevent unhandled promise rejections from the SDK
            if (typeof ws?.on === "function") {
              ws.on("error", (wsErr: unknown) => {
                const errMsg =
                  wsErr instanceof Error
                    ? wsErr.message
                    : typeof wsErr === "object" && wsErr !== null && "message" in wsErr
                      ? String((wsErr as { message: unknown }).message)
                      : "Cartesia WebSocket error";
                setError(errMsg);
                setState("error");
              });
            }
            wsRef.current = ws;
          }

          if (!contextRef.current && wsRef.current) {
            setState("buffering");
            hasPushedTranscriptRef.current = false;
            const ctx = wsRef.current.context({
              model_id: modelId,
              voice: { mode: "id", id: voiceId },
              output_format: {
                container: "raw",
                encoding: "pcm_f32le",
                sample_rate: SAMPLE_RATE,
              },
              language: "en",
            });
            contextRef.current = ctx;
            void startReceiving(ctx);
          }

          if (contextRef.current) {
            await contextRef.current.push({ transcript: text });
            hasPushedTranscriptRef.current = true;
          }
        })
        .catch((pushErr) => {
          setError(
            pushErr instanceof Error ? pushErr.message : "Failed to stream audio",
          );
          setState("error");
        });
    },
    [enabled, modelId, voiceId, ensureToken, startReceiving],
  );

  const finish = useCallback(() => {
    pushQueueRef.current = pushQueueRef.current
      .then(async () => {
        if (contextRef.current) {
          try {
            if (hasPushedTranscriptRef.current) {
              await contextRef.current.no_more_inputs();
            } else if (typeof contextRef.current.cancel === "function") {
              await contextRef.current.cancel();
            }
          } catch {
            // Ignore
          }
          contextRef.current = null;
          hasPushedTranscriptRef.current = false;
        }
      })
      .catch(() => {
        contextRef.current = null;
        hasPushedTranscriptRef.current = false;
      });
  }, []);

  useEffect(() => {
    return () => {
      cancel();
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        void audioCtxRef.current.close();
      }
    };
  }, [cancel]);

  return {
    state,
    pushText,
    finish,
    cancel,
    error,
  };
}
