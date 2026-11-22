// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  useStudyChatMock,
  mockUseTTSPlayback,
  mockPushText,
  mockFinish,
  mockCancel,
} = vi.hoisted(() => {
  const pushText = vi.fn();
  const finish = vi.fn();
  const cancel = vi.fn();
  const useTTS = vi.fn(() => ({
    state: "idle",
    pushText,
    finish,
    cancel,
    error: null,
  }));
  return {
    useStudyChatMock: vi.fn(),
    mockUseTTSPlayback: useTTS,
    mockPushText: pushText,
    mockFinish: finish,
    mockCancel: cancel,
  };
});

vi.mock("../hooks/use-study-chat", () => ({
  useStudyChat: useStudyChatMock,
}));

vi.mock("../hooks/use-tts-playback", () => ({
  useTTSPlayback: mockUseTTSPlayback,
  DEFAULT_CARTESIA_VOICE_ID: "f786b574-daa5-4673-aa0c-cbe3e8534c02",
}));

import { StudyChatView } from "../views/study-chat-view";

describe("StudyChatView layout and rendering", () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    useStudyChatMock.mockReturnValue({
      messages: [],
      isLoading: false,
      isHistoryLoading: false,
      isReady: true,
      error: undefined,
      sendMessage: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the root container with viewport-constrained and overflow-hidden classes", () => {
    const { container } = render(<StudyChatView flashcardSetId="set-1" />);

    const root = container.firstElementChild as HTMLElement;
    expect(root.classList.contains("h-full")).toBe(true);
    expect(root.classList.contains("min-h-0")).toBe(true);
    expect(root.classList.contains("overflow-hidden")).toBe(true);
    expect(root.classList.contains("flex-col")).toBe(true);
  });

  it("renders header and textarea elements as fixed shrink-0 sections", () => {
    render(<StudyChatView flashcardSetId="set-1" />);

    expect(screen.getByText("English practice room")).toBeTruthy();
    expect(screen.getByRole("textbox", { name: /message/i })).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /record voice message/i }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: /send message/i })).toBeTruthy();
  });

  it("centers content when message history is empty", () => {
    const { container } = render(<StudyChatView flashcardSetId="set-1" />);

    expect(
      screen.getByText("What would you like to practise?"),
    ).toBeTruthy();

    const scrollContainer = container.querySelector('[aria-live="polite"]');
    expect(scrollContainer?.classList.contains("overflow-y-auto")).toBe(true);
    expect(scrollContainer?.classList.contains("min-h-0")).toBe(true);
    expect(scrollContainer?.classList.contains("flex-1")).toBe(true);

    const messageListContainer = scrollContainer?.firstElementChild;
    expect(messageListContainer?.classList.contains("justify-center")).toBe(true);
  });

  it("aligns content to start (justify-start) when messages are present to prevent top clipping", () => {
    useStudyChatMock.mockReturnValue({
      messages: [
        { id: "msg-1", type: "human", content: "Hello tutor" },
        { id: "msg-2", type: "ai", content: "Hello! How can I help you today?" },
      ],
      isLoading: false,
      isHistoryLoading: false,
      isReady: true,
      error: undefined,
      sendMessage: vi.fn(),
    });

    const { container } = render(<StudyChatView flashcardSetId="set-1" />);

    expect(screen.getByText("Hello tutor")).toBeTruthy();
    expect(
      screen.getByText("Hello! How can I help you today?"),
    ).toBeTruthy();

    const scrollContainer = container.querySelector('[aria-live="polite"]');
    const messageListContainer = scrollContainer?.firstElementChild;
    expect(messageListContainer?.classList.contains("justify-start")).toBe(true);
    expect(messageListContainer?.classList.contains("justify-center")).toBe(false);
  });

  it("renders the audio toggle button and allows toggling speech output", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();

    render(<StudyChatView flashcardSetId="set-1" />);

    const muteButton = screen.getByRole("button", { name: /mute tutor voice/i });
    expect(muteButton).toBeTruthy();

    await user.click(muteButton);

    expect(
      screen.getByRole("button", { name: /enable tutor voice/i }),
    ).toBeTruthy();
    expect(mockCancel).toHaveBeenCalled();
  });
});
