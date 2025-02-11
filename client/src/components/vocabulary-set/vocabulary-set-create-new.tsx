"use client";

import { useFlashCardsStore } from "@/common/hooks/use-flash-cards-store";
import VocabularySet from "./vocabulary-set";
import { useCreateVocabularySet } from "@/common/services/vocabulary-set/hooks/use-create-vocabulary-set";

export default function VocabularySetCreateNew() {
  const { flashCards, addFlashCard, deleteFlashCard, flashCardsNumber } =
    useFlashCardsStore((state) => state);

  const handleFormSubmit = (values) => {
    const { mutate } = useCreateVocabularySet({
      ...values,
      flashCards: flashCards
        .map(({ translation, definition }) =>
          translation !== "" && definition !== ""
            ? { translation, definition }
            : null
        )
        .filter(Boolean),
    });

    mutate();
  };

  return (
    <div className="space-y-4 py-10 px-8">
      <VocabularySet
        onFormSubmit={handleFormSubmit}
        onDeleteFlashCard={deleteFlashCard}
        flashCards={flashCards}
        flashCardsNumber={flashCardsNumber}
        onAddFlashCard={addFlashCard}
      />
    </div>
  );
}
