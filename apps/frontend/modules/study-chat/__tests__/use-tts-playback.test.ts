// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockPush = vi.fn().mockResolvedValue(undefined);
const mockNoMoreInputs = vi.fn().mockResolvedValue(undefined);
const mockCancel = vi.fn().mockResolvedValue(undefined);
const mockReceive = vi.fn().mockReturnValue((async function* () {})());

const mockContext = vi.fn().mockReturnValue({
  push: mockPush,
  no_more_inputs: mockNoMoreInputs,
  cancel: mockCancel,
  receive: mockReceive,
});

const mockWsClose = vi.fn();
const mockWebsocket = vi.fn().mockResolvedValue({
  context: mockContext,
  close: mockWsClose,
});

vi.mock("@cartesia/cartesia-js", () => {
  return {
    default: class MockCartesia {
      tts = {
        websocket: mockWebsocket,
      };
    },
    Cartesia: class MockCartesia {
      tts = {
        websocket: mockWebsocket,
      };
    },
  };
});

import { getCartesiaTTSToken } from "../api";
import { useTTSPlayback } from "../hooks/use-tts-playback";

describe("getCartesiaTTSToken API", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches access token successfully from backend", async () => {
    const mockResponse = {
      access_token: "mock-cartesia-ephemeral-token",
      expires_at: 1700000000,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getCartesiaTTSToken("user-jwt-token");

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/study-chat/tts/token"),
      expect.objectContaining({
        headers: {
          Authorization: "Bearer user-jwt-token",
        },
      }),
    );
  });

  it("throws error when endpoint returns failure status", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ detail: "Unauthorized" }),
    });

    await expect(getCartesiaTTSToken("bad-token")).rejects.toThrow(
      "Unauthorized",
    );
  });
});

describe("useTTSPlayback hook", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockNoMoreInputs.mockClear();
    mockCancel.mockClear();
    mockReceive.mockClear();
    mockContext.mockClear();
    mockWsClose.mockClear();
    mockWebsocket.mockClear();

    // Mock AudioContext
    class MockAudioContext {
      currentTime = 0;
      destination = {};
      createBuffer = vi.fn().mockReturnValue({
        getChannelData: vi.fn().mockReturnValue(new Float32Array(100)),
      });
      createBufferSource = vi.fn().mockReturnValue({
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        onended: null,
      });
      close = vi.fn().mockResolvedValue(undefined);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).AudioContext = MockAudioContext;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes in idle state when enabled", () => {
    const { result } = renderHook(() =>
      useTTSPlayback({ enabled: true, voiceId: "test-voice-id" }),
    );

    expect(result.current.state).toBe("idle");
    expect(result.current.error).toBeNull();
  });

  it("does not push text when disabled", async () => {
    const { result } = renderHook(() =>
      useTTSPlayback({ enabled: false, voiceId: "test-voice-id" }),
    );

    await act(async () => {
      result.current.pushText("Hello world");
    });

    expect(mockPush).not.toHaveBeenCalled();
    expect(result.current.state).toBe("idle");
  });

  it("cancels playback and resets state", async () => {
    const { result } = renderHook(() =>
      useTTSPlayback({ enabled: true, voiceId: "test-voice-id" }),
    );

    act(() => {
      result.current.cancel();
    });

    expect(result.current.state).toBe("idle");
    expect(result.current.error).toBeNull();
  });
});
