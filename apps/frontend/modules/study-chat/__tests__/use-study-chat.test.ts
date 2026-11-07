// @vitest-environment jsdom

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getStudyChatThreadId } from "../utils/thread";

const { streamState, getHistoryMock, getAccessTokenMock } = vi.hoisted(() => ({
  streamState: {
    messages: [],
    values: {},
    isLoading: false,
    error: undefined,
    submit: vi.fn(),
    stop: vi.fn(),
  },
  getHistoryMock: vi.fn(),
  getAccessTokenMock: vi.fn(),
}));

vi.mock("@langchain/react", () => ({
  useStream: vi.fn(() => streamState),
}));

vi.mock("@/modules/auth/api", () => ({
  getAccessToken: getAccessTokenMock,
}));

vi.mock("../api", () => ({
  getStudyChatHistory: getHistoryMock,
}));

import { useStudyChat } from "../hooks/use-study-chat";

function accessToken(userId: string): string {
  const payload = btoa(JSON.stringify({ sub: userId }));
  return `header.${payload}.signature`;
}

describe("useStudyChat", () => {
  beforeEach(() => {
    getAccessTokenMock.mockReturnValue(accessToken("user-123"));
    getHistoryMock.mockResolvedValue([
      {
        role: "user",
        content: "Hello",
        inline_inspector: null,
      },
    ]);
    streamState.submit.mockReset().mockResolvedValue(undefined);
    streamState.stop.mockReset().mockResolvedValue(undefined);
    streamState.messages = [];
    streamState.values = {};
    streamState.isLoading = false;
    streamState.error = undefined;
  });

  it("loads FastAPI history and submits a complete graph input", async () => {
    const { result } = renderHook(() => useStudyChat("set-123"));

    await waitFor(() => expect(result.current.isHistoryLoading).toBe(false));

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe("Hello");

    await act(async () => {
      await result.current.sendMessage("I has a car.", "B2");
    });

    expect(streamState.submit).toHaveBeenCalledWith(
      expect.objectContaining({
        flashcard_set_id: "set-123",
        user_id: "user-123",
        thread_id: getStudyChatThreadId("set-123", "user-123"),
        language_level: "B2",
        inspection_request_id: expect.any(String),
      }),
      { multitaskStrategy: "reject" },
    );
    expect(result.current.messages.at(-2)?.content).toBe("I has a car.");
  });
});
