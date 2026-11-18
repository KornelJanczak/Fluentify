import { describe, expect, it } from "vitest";
import { getStudyChatThreadId } from "../utils/thread";

describe("getStudyChatThreadId", () => {
  it("returns the flashcardSetId directly as threadId", () => {
    const threadId = getStudyChatThreadId("set-123");
    expect(threadId).toBe("set-123");
  });
});
