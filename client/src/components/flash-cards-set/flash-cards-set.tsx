"use client";

import { FlashCardsSetFormValues } from "@/common/hooks/use-flash-cards-set-form";
import { FlashCardsSetForm } from "./form";
import FlashCardsSetHeader from "./header";
import FlashCards, { FlashCardsProps } from "./flash-cards";
import AddFlashCard from "./add-flash-card";
import { FlashCardStore } from "@/common/hooks/use-flash-cards-set-create-new";

export interface FlashCardsSetProps extends FlashCardsProps {
  defaultFormValues?: FlashCardsSetFormValues;
  flashCardsNumber: number;
  onFormSubmit: () => void;
  onDeleteFlashCard: (flashCardId: string) => void;
  onAddFlashCard: () => void;
}

export default function FlashCardsSet({
  defaultFormValues,
  flashCards,
  flashCardsNumber,
  onFormSubmit,
  onDeleteFlashCard,
  onAddFlashCard,
}: FlashCardsSetProps) {
  return (
    <>
      <FlashCardsSetHeader />
      <FlashCardsSetForm
        onSubmit={onFormSubmit}
        defaultValues={defaultFormValues}
      />
      <FlashCards
        flashCards={flashCards}
        onDeleteFlashCard={onDeleteFlashCard}
      />
      <AddFlashCard index={flashCardsNumber} onAddFlashCard={onAddFlashCard} />
    </>
  );
}
