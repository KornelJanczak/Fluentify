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
  console.log(vocabularySet);

  const { flashCards, addFlashCards, addFlashCard, deleteFlashCard } =
    useFlashCardsStore((state) => state);

  useEffect(() => {
    addFlashCards(vocabularySet.flashCards);
  }, [vocabularySet.flashCards, addFlashCards]);

  return (
    <VocabularySet
      defaultFormValues={{
        title: vocabularySet.title,
        description: vocabularySet.description,
      }}
      flashCards={flashCards}
      flashCardsNumber={vocabularySet.flashCards.length}
      onAddFlashCard={addFlashCard}
      onDeleteFlashCard={deleteFlashCard}
      onFormSubmit={(values) => console.log(values)}
    />
  );
}
