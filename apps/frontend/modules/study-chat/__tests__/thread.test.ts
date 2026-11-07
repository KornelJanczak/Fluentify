import { describe, expect, it } from "vitest";
import { getStudyChatThreadId } from "../utils/thread";

describe("getStudyChatThreadId", () => {
  it("generates a valid RFC-4122 UUIDv5", () => {
    const threadId = getStudyChatThreadId("set-123", "user-123");
    const uuidv5Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(threadId).toMatch(uuidv5Regex);
  });

  it("is deterministic and matches python uuid.uuid5 standard", () => {
    const threadId1 = getStudyChatThreadId("set-123", "user-123");
    const threadId2 = getStudyChatThreadId("set-123", "user-123");
    expect(threadId1).toBe(threadId2);
    expect(threadId1).toBe("9ccd97f5-22ac-51d5-b824-8c75926934e7");
  });

  it("produces distinct UUIDs for different sets or users", () => {
    const threadIdA = getStudyChatThreadId("set-123", "user-123");
    const threadIdB = getStudyChatThreadId("set-456", "user-123");
    const threadIdC = getStudyChatThreadId("set-123", "user-456");

    expect(threadIdA).not.toBe(threadIdB);
    expect(threadIdA).not.toBe(threadIdC);
  });
});
