"use client";

import { create } from "zustand";
import { FlashCard } from "../services/flash-card/flash-card.service";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

interface FlashCardsStore {
  flashCards: FlashCardStore[];
  flashCardsNumber: number;
  addFlashCard: () => void;
  deleteFlashCard: (flashCardId: string) => void;
  updateFlashCard: (flashCardId: string, flashCard: FlashCardStore) => void;
}

export const useFlashCardsStore = create<FlashCardsStore>()(
  persist(
    (set) => ({
      flashCards: [],
      flashCardsNumber: 0,
      addFlashCard: () =>
        set((state) => ({
          flashCards: [
            ...state.flashCards,
            { id: uuidv4(), translation: "", definition: "" },
          ],
          flashCardsNumber: state.flashCardsNumber + 1,
        })),
      deleteFlashCard: (flashCardId: string) =>
        set((state) => ({
          flashCards: state.flashCards.filter(
            (flashCard: FlashCardStore) => flashCard.id !== flashCardId
          ),
          flashCardsNumber: state.flashCardsNumber - 1,
        })),
      updateFlashCard: (flashCardId: string, newflashCard) =>
        set((state) => ({
          flashCards: state.flashCards.map((flashCard) =>
            flashCard.id === flashCardId ? newflashCard : flashCard
          ),
          flashCardsNumber: state.flashCardsNumber,
        })),
    }),
    {
      name: "flash-cards-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export type FlashCardStore = Omit<FlashCard, "vocabularySetId">;
