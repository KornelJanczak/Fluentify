"use client";

import { FlashCardsSetFormValues } from "@/common/hooks/use-flash-cards-set-form";
import { VocabularySetForm } from "./form";
import { Markdown } from "../markdown";
import FlashCards, { FlashCardsProps } from "./flash-cards";
import AddFlashCard from "./add-flash-card";
import { Button } from "../ui/button";
import SectionWrapper from "../section-wrapper";
import { Oval } from "react-loader-spinner";

export interface VocabularySet extends FlashCardsProps {
  markdownContent: string;
  buttonContent: string;
  defaultFormValues?: FlashCardsSetFormValues;
  isPending: boolean;
  onFormSubmit: (values: FlashCardsSetFormValues) => void;
}

export default function VocabularySet({
  markdownContent,
  buttonContent,
  defaultFormValues,
  flashCards,
  isPending,
  onFormSubmit,
}: VocabularySet) {
  return (
    <SectionWrapper>
      <div className="flex flex-col space-y-6 w-full max-w-5xl">
        <Markdown>{`## ${markdownContent}`}</Markdown>
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
