"use client";

import { useFlashCardsStore } from "@/common/hooks/use-flash-cards-set-create-new";
import VocabularySet from "./vocabulary-set";

export default function VocabularySetCreateNew() {
  const { flashCards, addFlashCard, deleteFlashCard, flashCardsNumber } =
    useFlashCardsStore((state) => state);

  return (
    <div className="space-y-4 py-10 px-8">
      <VocabularySet
        onFormSubmit={() => {
          console.log("Form submitted");
        }}
        onDeleteFlashCard={deleteFlashCard}
        flashCards={flashCards}
        flashCardsNumber={flashCardsNumber}
        onAddFlashCard={addFlashCard}
      />
    </div>
  );
}
