"use client";

import { create } from "zustand";
import { FlashCard } from "../api/services/vocabulary-set.service";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

interface FlashCardsStore {
  flashCards: FlashCardStore[];
  flashCardsNumber: number;
  addFlashCards: (flashCards: FlashCardStore[]) => void;
  addFlashCard: () => void;
  deleteFlashCard: (flashCardId: string) => void;
  updateDefinitionOnChange: (flashCardId: string, definition: string) => void;
  updateTranslationOnChange: (flashCardId: string, translation: string) => void;
  resetState: () => void;
}

const initialState = {
  flashCards: [],
  flashCardsNumber: 0,
};

export const useFlashCardsStore = create<FlashCardsStore>()(
  persist(
    (set) => ({
      ...initialState,
      addFlashCards: (flashCards: FlashCardStore[]) =>
        set(() => ({
          flashCards: flashCards,
        })),
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
      updateDefinitionOnChange: (flashCardId: string, definition: string) =>
        set((state) => ({
          flashCards: state.flashCards.map((flashCard) =>
            flashCard.id === flashCardId
              ? {
                  ...flashCard,
                  definition: definition.trim().toLocaleLowerCase(),
                }
              : flashCard
          ),
          flashCardsNumber: state.flashCardsNumber,
        })),
      updateTranslationOnChange: (flashCardId: string, translation: string) =>
        set((state) => ({
          flashCards: state.flashCards.map((flashCard) =>
            flashCard.id === flashCardId
              ? {
                  ...flashCard,
                  translation: translation.trim().toLocaleLowerCase(),
                }
              : flashCard
          ),
          flashCardsNumber: state.flashCardsNumber,
        })),
      resetState: () => {
        set(initialState);
      },
    }),
    {
      name: "flash-cards-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export type FlashCardStore = Omit<FlashCard, "vocabularySetId">;
