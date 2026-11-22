import { http } from "@/infrastructure/http/client";
import type {
  Flashcard,
  FlashcardDraft,
  FlashcardSet,
  FlashcardSetDetails,
} from "./types";

export function getFlashcardSets(): Promise<FlashcardSet[]> {
  return http<FlashcardSet[]>("/flashcard-sets");
}

export function getFlashcardSet(id: string): Promise<FlashcardSetDetails> {
  return http<FlashcardSetDetails>(`/flashcard-sets/${id}`);
}

export function createFlashcardSet(
  name: string,
  flashcards: FlashcardDraft[],
): Promise<FlashcardSetDetails> {
  return http<FlashcardSetDetails>("/flashcard-sets", {
    method: "POST",
    body: JSON.stringify({
      name,
      flashcards: flashcards.map(
        ({
          definition,
          definition_translation,
          language,
          example_sentences,
        }) => ({
          definition,
          definition_translation,
          language,
          example_sentences,
        }),
      ),
    }),
  });
}

export function updateFlashcardSet(
  id: string,
  name: string,
): Promise<FlashcardSet> {
  return http<FlashcardSet>(`/flashcard-sets/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

export function deleteFlashcardSet(id: string): Promise<void> {
  return http<void>(`/flashcard-sets/${id}`, { method: "DELETE" });
}

export function createFlashcard(
  setId: string,
  card: FlashcardDraft,
): Promise<Flashcard> {
  return http<Flashcard>("/flashcards", {
    method: "POST",
    body: JSON.stringify({ ...card, flashcard_set_id: setId }),
  });
}

export function updateFlashcard(
  id: string,
  card: FlashcardDraft,
): Promise<Flashcard> {
  return http<Flashcard>(`/flashcards/${id}`, {
    method: "PATCH",
    body: JSON.stringify(card),
  });
}

export function deleteFlashcard(id: string): Promise<void> {
  return http<void>(`/flashcards/${id}`, { method: "DELETE" });
}
