"use client";

import { FlashCardsSetFormValues } from "@/common/hooks/use-flash-cards-set-form";
import { VocabularySetForm } from "./form";
import { Markdown } from "../markdown";
import FlashCards, { FlashCardsProps } from "./flash-cards";
import AddFlashCard from "./add-flash-card";
import { Button } from "../ui/button";
import SectionWrapper from "../section-wrapper";

export interface VocabularySet extends FlashCardsProps {
  defaultFormValues?: FlashCardsSetFormValues;
  flashCardsNumber: number;
  onFormSubmit: (values) => void;
  onDeleteFlashCard: (flashCardId: string) => void;
  onAddFlashCard: () => void;
}

export default function VocabularySet({
  defaultFormValues,
  flashCards,
  flashCardsNumber,
  onFormSubmit,
  onDeleteFlashCard,
  onAddFlashCard,
}: VocabularySet) {
  return (
    <SectionWrapper>
      <div className="flex flex-col space-y-6 w-full max-w-5xl">
        <Markdown>## Create new vocabulary set</Markdown>
        <VocabularySetForm
          onSubmit={onFormSubmit}
          defaultValues={defaultFormValues}
        />
        <FlashCards
          flashCards={flashCards}
          onDeleteFlashCard={onDeleteFlashCard}
        />
        <AddFlashCard
          index={flashCardsNumber}
          onAddFlashCard={onAddFlashCard}
        />
        <Button
          type="submit"
          form="flash-cards-set-form"
          className="mt-4 self-end"
        >
          Create
        </Button>
      </div>
    </SectionWrapper>
  );
}
