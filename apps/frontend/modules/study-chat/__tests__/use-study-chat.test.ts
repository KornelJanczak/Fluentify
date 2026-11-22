// @vitest-environment jsdom

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { streamState, getHistoryMock, getAccessTokenMock } = vi.hoisted(() => ({
  streamState: {
    messages: [] as Array<{ id?: string; type: string; content: string }>,
    values: {} as Record<string, unknown>,
    isLoading: false,
    error: undefined as unknown,
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

const fixedToken = accessToken("user-123");

describe("useStudyChat", () => {
  beforeEach(() => {
    getAccessTokenMock.mockReturnValue(fixedToken);
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

  it("loads FastAPI history and submits a complete graph input with flashcardSetId as thread_id", async () => {
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
        thread_id: "set-123",
        language_level: "B2",
        inspection_request_id: expect.any(String),
      }),
      { multitaskStrategy: "reject" },
    );
    expect(result.current.messages.at(-2)?.content).toBe("I has a car.");
  });

  it("passes flashcardSetId directly as threadId to useStream", async () => {
    const { useStream } = await import("@langchain/react");
    renderHook(() => useStudyChat("set-123"));

    const call = vi.mocked(useStream).mock.calls.at(-1)?.[0];
    expect(call?.threadId).toBe("set-123");
    expect(call?.defaultHeaders).toEqual({
      Authorization: `Bearer ${accessToken("user-123")}`,
    });
  });

  it("memoizes defaultHeaders to avoid re-triggering useStream client hydration", async () => {
    const { useStream } = await import("@langchain/react");
    vi.mocked(useStream).mockClear();

    const { rerender } = renderHook(() => useStudyChat("set-123"));

    // useSyncExternalStore commits client snapshot, so the stable headers are established
    const initialCall = vi.mocked(useStream).mock.calls.at(-1)?.[0];
    expect(initialCall?.defaultHeaders).toEqual({
      Authorization: `Bearer ${fixedToken}`,
    });

    rerender();

    const rerenderCall = vi.mocked(useStream).mock.calls.at(-1)?.[0];
    expect(rerenderCall?.defaultHeaders).toBe(initialCall?.defaultHeaders);
  });

  it("ignores inspector JSON payload in assistant stream and updates message with reply", async () => {
    const { result, rerender } = renderHook(() => useStudyChat("set-123"));

    await waitFor(() => expect(result.current.isHistoryLoading).toBe(false));

    await act(async () => {
      await result.current.sendMessage("test", "B2");
    });

    // Simulate stream emitting inspector payload as an AI message chunk
    act(() => {
      streamState.messages = [
        {
          type: "human",
          content: "test",
        },
        {
          type: "ai",
          content: "Great effort! Can you make another sentence?",
        },
        {
          type: "ai",
          content: '{"original_message":"test","corrected_message":null,"errors":[]}',
        },
      ];
    });

    rerender();

    // The assistant message must NOT be replaced with the inspector JSON payload
    expect(result.current.messages.at(-1)?.content).toBe(
      "Great effort! Can you make another sentence?",
    );

    // When stream.values.reply arrives, it takes precedence
    act(() => {
      streamState.values = {
        reply: "Final tutor reply from graph state.",
      };
    });

    rerender();

    expect(result.current.messages.at(-1)?.content).toBe(
      "Final tutor reply from graph state.",
    );
  });

  it("does not leak previous turn reply or messages when sending a new message", async () => {
    // Thread already has a finished turn from a previous run
    streamState.values = {
      reply: "Previous tutor response.",
    };
    streamState.messages = [
      {
        id: "msg-human-1",
        type: "human",
        content: "First user question",
      },
      {
        id: "msg-ai-1",
        type: "ai",
        content: "Previous tutor response.",
      },
    ];

    const { result, rerender } = renderHook(() => useStudyChat("set-123"));
    await waitFor(() => expect(result.current.isHistoryLoading).toBe(false));

    // Send the second message
    await act(async () => {
      await result.current.sendMessage("Second question", "B2");
    });

    // The newly created assistant message must be empty (composing), NOT the previous reply!
    expect(result.current.messages.at(-1)?.type).toBe("ai");
    expect(result.current.messages.at(-1)?.content).toBe("");

    // Simulate new token streaming
    act(() => {
      streamState.messages = [
        ...streamState.messages,
        {
          id: "msg-human-2",
          type: "human",
          content: "Second question",
        },
        {
          id: "msg-ai-2",
          type: "ai",
          content: "New live answer",
        },
      ];
    });

    rerender();

    // Now it should show the streamed chunk
    expect(result.current.messages.at(-1)?.content).toBe("New live answer");

    // When the new reply finishes in the graph state
    act(() => {
      streamState.values = {
        reply: "New live answer completed.",
      };
    });

    rerender();

    expect(result.current.messages.at(-1)?.content).toBe(
      "New live answer completed.",
    );
  });

  it("tracks streamedReplyText and isStreaming during active turn", async () => {
    const { result, rerender } = renderHook(() => useStudyChat("set-123"));
    await waitFor(() => expect(result.current.isHistoryLoading).toBe(false));

    expect(result.current.isStreaming).toBe(false);
    expect(result.current.streamedReplyText).toBe("");

    await act(async () => {
      await result.current.sendMessage("Hello", "B2");
    });

    // When stream is actively streaming
    act(() => {
      streamState.isLoading = true;
      streamState.messages = [
        { type: "human", content: "Hello" },
        { id: "ai-new", type: "ai", content: "Hello! How can I help you today?" },
      ];
    });

    rerender();

    expect(result.current.isStreaming).toBe(true);
    expect(result.current.streamedReplyText).toBe(
      "Hello! How can I help you today?",
    );

    // When stream completes
    act(() => {
      streamState.isLoading = false;
    });

    rerender();

    expect(result.current.isStreaming).toBe(false);
  });
});
