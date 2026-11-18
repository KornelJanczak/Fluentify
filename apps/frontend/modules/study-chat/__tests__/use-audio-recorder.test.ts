// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAudioRecorder } from "../hooks/use-audio-recorder";

describe("useAudioRecorder hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("initializes with default idle state", () => {
    const { result } = renderHook(() => useAudioRecorder());

    expect(result.current.isRecording).toBe(false);
    expect(result.current.recordingDuration).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it("sets error when getUserMedia is not supported", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (navigator as any).mediaDevices;

    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.isRecording).toBe(false);
    expect(result.current.error).toBe(
      "Microphone is not supported in this browser.",
    );

    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });

  it("starts recording and increments recordingDuration", async () => {
    const stopTrack = vi.fn();
    const mockStream = {
      getTracks: () => [{ stop: stopTrack }],
    };

    const mockGetUserMedia = vi.fn().mockResolvedValue(mockStream);
    Object.defineProperty(navigator, "mediaDevices", {
      value: { getUserMedia: mockGetUserMedia },
      writable: true,
      configurable: true,
    });

    class MockMediaRecorder {
      static isTypeSupported = vi.fn().mockReturnValue(true);
      state = "recording";
      mimeType = "audio/webm";
      ondataavailable: ((e: { data: Blob }) => void) | null = null;
      onstop: (() => void) | null = null;
      onerror: (() => void) | null = null;

      start = vi.fn();
      stop = vi.fn(() => {
        this.state = "inactive";
        if (this.ondataavailable) {
          this.ondataavailable({ data: new Blob(["dummy audio"], { type: "audio/webm" }) });
        }
        if (this.onstop) {
          this.onstop();
        }
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).MediaRecorder = MockMediaRecorder;

    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.isRecording).toBe(true);
    expect(result.current.recordingDuration).toBe(0);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.recordingDuration).toBe(3);

    let recordedBlob: Blob | null = null;
    await act(async () => {
      recordedBlob = await result.current.stopRecording();
    });

    expect(result.current.isRecording).toBe(false);
    expect(recordedBlob).toBeInstanceOf(Blob);
    expect(stopTrack).toHaveBeenCalled();
  });

  it("handles cancelRecording properly", async () => {
    const stopTrack = vi.fn();
    const mockStream = {
      getTracks: () => [{ stop: stopTrack }],
    };

    Object.defineProperty(navigator, "mediaDevices", {
      value: { getUserMedia: vi.fn().mockResolvedValue(mockStream) },
      writable: true,
      configurable: true,
    });

    class MockMediaRecorder {
      static isTypeSupported = vi.fn().mockReturnValue(true);
      state = "recording";
      mimeType = "audio/webm";
      start = vi.fn();
      stop = vi.fn();
      ondataavailable = null;
      onstop = null;
      onerror = null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).MediaRecorder = MockMediaRecorder;

    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.isRecording).toBe(true);

    act(() => {
      result.current.cancelRecording();
    });

    expect(result.current.isRecording).toBe(false);
    expect(result.current.recordingDuration).toBe(0);
    expect(stopTrack).toHaveBeenCalled();
  });
});
