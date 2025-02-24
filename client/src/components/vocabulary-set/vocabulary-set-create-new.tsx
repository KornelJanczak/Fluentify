"use client";

import { useFlashCardsStore } from "@/common/hooks/use-flash-cards-store";
import VocabularySet from "./vocabulary-set";
import { useCreateVocabularySet } from "@/common/hooks/use-create-vocabulary-set";
import { FlashCardsSetFormValues } from "@/common/hooks/use-flash-cards-set-form";

export default function VocabularySetCreateNew() {
  const { flashCards, resetState } = useFlashCardsStore((state) => state);
  const { mutate } = useCreateVocabularySet();

  const handleFormSubmit = (values: FlashCardsSetFormValues) => {
    mutate({
      ...values,
      flashCards,
    });
    resetState();
  };

  return (
    <VocabularySet
      markdownContent="Create new vocabulary set"
      buttonContent="Create"
      flashCards={flashCards}
      onFormSubmit={handleFormSubmit}
    />
  );
}
