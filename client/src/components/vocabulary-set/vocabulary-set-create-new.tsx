"use client";

import { useFlashCardsStore } from "@/common/hooks/use-flash-cards-store";
import VocabularySet from "./vocabulary-set";
import { useCreateVocabularySet } from "@/common/hooks/use-create-vocabulary-set";
import { FlashCardsSetFormValues } from "@/common/hooks/use-flash-cards-set-form";
import { validateFlashCards } from "@/lib/helpers";

export default function VocabularySetCreateNew() {
  const { flashCards } = useFlashCardsStore((state) => state);
  const { mutate, isPending } = useCreateVocabularySet();

  const handleFormSubmit = (values: FlashCardsSetFormValues) => {
    const isValid = validateFlashCards(flashCards);

    if (!isValid) return;

    mutate({
      ...values,
      flashCards,
    });
  };

  return (
    <VocabularySet
      markdownContent="Create new vocabulary set"
      buttonContent="Create"
      flashCards={flashCards}
      onFormSubmit={handleFormSubmit}
      isPending={isPending}
    />
  );
}
