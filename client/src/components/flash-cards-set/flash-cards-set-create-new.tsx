"use client";

import { useFlashCardsStore } from "@/common/hooks/use-flash-cards-set-create-new";
import FlashCardsSet from "./flash-cards-set";

export default function FlashCardsSetCreateNew() {
  const { flashCards, addFlashCard, deleteFlashCard, flashCardsNumber } =
    useFlashCardsStore((state) => state);

  return (
    <div className="space-y-4 py-10 px-8">
      <FlashCardsSet
        onFormSubmit={() => {}}
        onDeleteFlashCard={deleteFlashCard}
        flashCards={flashCards}
        flashCardsNumber={flashCardsNumber}
        onAddFlashCard={addFlashCard}
      />
    </div>
  );
}
