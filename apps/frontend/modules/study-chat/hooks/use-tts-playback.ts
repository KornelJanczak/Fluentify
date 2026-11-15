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
}: UseTTSPlaybackOptions): UseTTSPlaybackResult {
  const [state, setState] = useState<TTSPlaybackState>("idle");
  const [error, setError] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wsRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contextRef = useRef<any>(null);
  const tokenCacheRef = useRef<{ token: string; expiresAt: number } | null>(null);
  const isReceivingRef = useRef<boolean>(false);

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
      }
    },
    [schedulePlayback],
  );

  const pushText = useCallback(
    (text: string) => {
      if (!enabled || !text.trim()) return;

      void (async () => {
        try {
          if (!wsRef.current) {
            setState("buffering");
            const token = await ensureToken();
            const client = new Cartesia({ apiKey: token });
            wsRef.current = await client.tts.websocket();
          }

          if (!contextRef.current && wsRef.current) {
            setState("buffering");
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
          }
        } catch (pushErr) {
          setError(
            pushErr instanceof Error ? pushErr.message : "Failed to stream audio",
          );
          setState("error");
        }
      })();
    },
    [enabled, modelId, voiceId, ensureToken, startReceiving],
  );

  const finish = useCallback(() => {
    if (contextRef.current) {
      try {
        void contextRef.current.no_more_inputs();
      } catch {
        // Ignore
      }
      contextRef.current = null;
    }
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
