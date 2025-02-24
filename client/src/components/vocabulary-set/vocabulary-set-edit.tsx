"use client";

import { VocabularySetWithFlashCards } from "@/common/api/services/vocabulary-set.service";
import VocabularySet from "./vocabulary-set";
import { useFlashCardsStore } from "@/common/hooks/use-flash-cards-store";
import { useEffect } from "react";
import { useUpdateVocabularySet } from "@/common/hooks/use-update-vocabulary-set";
import { FlashCardsSetFormValues } from "@/common/hooks/use-flash-cards-set-form";

interface VocabularySetEditProps {
  vocabularySet: VocabularySetWithFlashCards;
}

export default function VocabularySetEdit({
  vocabularySet,
}: VocabularySetEditProps) {
  const { flashCards, addFlashCards } = useFlashCardsStore((state) => state);
  const { mutate } = useUpdateVocabularySet();

  useEffect(() => {
    addFlashCards(vocabularySet.flashCards);
  }, [vocabularySet.flashCards]);

  const handleFormSubmit = (values: FlashCardsSetFormValues) => {
    mutate({
      id: vocabularySet.id,
      vocabularySet: { ...values, flashCards: flashCards },
    });
  };

  return (
    <VocabularySet
      markdownContent="Edit vocabulary set"
      buttonContent="Save"
      flashCards={flashCards}
      onFormSubmit={handleFormSubmit}
      defaultFormValues={{
        title: vocabularySet.title,
        description: vocabularySet.description,
      }}
    />
  );
}
