"use client";

import { useFlashCardsStore } from "@/common/hooks/use-flash-cards-store";
import VocabularySet from "./vocabulary-set";
import { useCreateVocabularySet } from "@/common/services/vocabulary-set/hooks/use-create-vocabulary-set";
import { FlashCardsSetFormValues } from "@/common/hooks/use-flash-cards-set-form";

export default function VocabularySetCreateNew() {
  const { flashCards, addFlashCard, deleteFlashCard, flashCardsNumber } =
    useFlashCardsStore((state) => state);
  const { mutate } = useCreateVocabularySet();

  const handleFormSubmit = (values: FlashCardsSetFormValues) =>
    mutate({
      ...values,
      flashCards,
    });

  return (
    <VocabularySet
      onFormSubmit={handleFormSubmit}
      onDeleteFlashCard={deleteFlashCard}
      flashCards={flashCards}
      flashCardsNumber={flashCardsNumber}
      onAddFlashCard={addFlashCard}
    />
  );
}
