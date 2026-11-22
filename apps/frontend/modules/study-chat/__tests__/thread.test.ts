import { describe, expect, it } from "vitest";
import { getStudyChatThreadId } from "../utils/thread";

describe("getStudyChatThreadId", () => {
  it("generates deterministic RFC-4122 UUIDv5 for user and flashcardSet", () => {
    const threadId1 = getStudyChatThreadId("user-1", "set-123");
    const threadId2 = getStudyChatThreadId("user-1", "set-123");
    const threadIdUser2 = getStudyChatThreadId("user-2", "set-123");
    const threadIdSet2 = getStudyChatThreadId("user-1", "set-456");

    expect(threadId1).toBe(threadId2);
    expect(threadId1).not.toBe(threadIdUser2);
    expect(threadId1).not.toBe(threadIdSet2);
    // UUIDv5 regex
    expect(threadId1).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });
});
