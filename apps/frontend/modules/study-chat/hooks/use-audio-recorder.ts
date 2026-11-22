"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type UseAudioRecorderResult = {
  isRecording: boolean;
  recordingDuration: number;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  cancelRecording: () => void;
  clearError: () => void;
};

function getSupportedMimeType(): string | undefined {
  if (typeof window === "undefined" || !("MediaRecorder" in window)) {
    return undefined;
  }
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  return types.find((type) => MediaRecorder.isTypeSupported(type));
}

export function useAudioRecorder(): UseAudioRecorderResult {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopResolverRef = useRef<((blob: Blob | null) => void) | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopStreamTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const cancelRecording = useCallback(() => {
    clearTimer();
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.onstop = null;
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore errors on forced stop
      }
    }
    stopStreamTracks();
    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingDuration(0);
    if (stopResolverRef.current) {
      stopResolverRef.current(null);
      stopResolverRef.current = null;
    }
  }, [clearTimer, stopStreamTracks]);

  const startRecording = useCallback(async () => {
    setError(null);
    if (
      typeof window === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setError("Microphone is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(stream, options);

      audioChunksRef.current = [];

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setError("Audio recording failed.");
        cancelRecording();
      };

      recorder.onstop = () => {
        const resolvedMime = recorder.mimeType || "audio/webm";
        const audioBlob =
          audioChunksRef.current.length > 0
            ? new Blob(audioChunksRef.current, { type: resolvedMime })
            : null;

        if (stopResolverRef.current) {
          stopResolverRef.current(audioBlob);
          stopResolverRef.current = null;
        }
        stopStreamTracks();
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250); // collect chunks every 250ms

      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      stopStreamTracks();
      const errorObj = err as { name?: string; message?: string };
      if (
        errorObj.name === "NotAllowedError" ||
        errorObj.name === "PermissionDeniedError"
      ) {
        setError(
          "Microphone permission was denied. Please allow microphone access in your browser.",
        );
      } else {
        setError(
          "Failed to access microphone. Please check your audio device.",
        );
      }
    }
  }, [cancelRecording, stopStreamTracks]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    clearTimer();
    return new Promise<Blob | null>((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        setIsRecording(false);
        stopStreamTracks();
        resolve(null);
        return;
      }

      stopResolverRef.current = resolve;
      setIsRecording(false);
      try {
        recorder.stop();
      } catch {
        stopStreamTracks();
        resolve(null);
      }
    });
  }, [clearTimer, stopStreamTracks]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      stopStreamTracks();
    };
  }, [clearTimer, stopStreamTracks]);

  return {
    isRecording,
    recordingDuration,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
    clearError,
  };
}
