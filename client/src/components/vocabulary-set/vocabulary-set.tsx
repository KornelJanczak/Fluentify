"use client";

import { type FlashCard } from "@/common/api/services/vocabulary-set.service";
import { FlashCardsSetFormValues } from "@/common/hooks/vocabulary-set/use-flash-cards-set-form";
import { VocabularySetForm } from "./form";
import { Markdown } from "../markdown";
import AddFlashCard from "./add-flash-card";
import { Button } from "../ui/button";
import SectionWrapper from "../section-wrapper";
import FlashCards from "./flash-cards";

import { Oval } from "react-loader-spinner";

export interface VocabularySet {
  markdownContent: string;
  buttonContent: string;
  defaultFormValues?: FlashCardsSetFormValues;
  deleteButton?: React.ReactNode;
  isPending: boolean;
  onFormSubmit: (values: FlashCardsSetFormValues) => void;
  flashCards: Omit<FlashCard, "vocabularySetId">[];
}

export default function VocabularySet({
  markdownContent,
  buttonContent,
  defaultFormValues,
  flashCards,
  deleteButton,
  isPending,
  onFormSubmit,
}: VocabularySet) {
  return (
    <SectionWrapper>
      <div className="flex flex-col space-y-6 w-full max-w-5xl">
        <div className="flex justify-between items-center w-full">
          <Markdown>{`## ${markdownContent}`}</Markdown>
          {deleteButton}
        </div>
        <VocabularySetForm
          onSubmit={onFormSubmit}
          defaultValues={defaultFormValues}
        />

        <FlashCards flashCards={flashCards} />
        <AddFlashCard />
        <Button
          type="submit"
          form="flash-cards-set-form"
          className="mt-4 self-end"
          disabled={isPending}
        >
          {!isPending && buttonContent}
          {isPending && <Oval color="#fff" height={20} width={20} />}
        </Button>
      </div>
    </SectionWrapper>
  );
}
