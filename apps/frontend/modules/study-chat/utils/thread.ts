import { v5 as uuidv5 } from "uuid";

export const STUDY_CHAT_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

export function getStudyChatThreadId(
  userId: string,
  flashcardSetId: string,
): string {
  return uuidv5(`study_chat:${userId}:${flashcardSetId}`, STUDY_CHAT_NAMESPACE);
}
