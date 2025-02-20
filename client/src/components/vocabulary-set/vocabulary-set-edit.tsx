"use client";

import { VocabularySetWithFlashCards } from "@/common/services/vocabulary-set/vocabulary-set.service";
import VocabularySet from "./vocabulary-set";
import { useFlashCardsStore } from "@/common/hooks/use-flash-cards-store";
import { useEffect } from "react";

interface VocabularySetEditProps {
  vocabularySet: VocabularySetWithFlashCards;
}

export default function VocabularySetEdit({
  vocabularySet,
}: VocabularySetEditProps) {
  const { flashCards, addFlashCards } = useFlashCardsStore((state) => state);

  useEffect(() => {
    addFlashCards(vocabularySet.flashCards);
  }, [vocabularySet.flashCards, addFlashCards]);

  return (
    <VocabularySet
      flashCards={flashCards}
      defaultFormValues={{
        title: vocabularySet.title,
        description: vocabularySet.description,
      }}
      flashCardsNumber={vocabularySet.flashCards.length}
      
    />
  );
}
