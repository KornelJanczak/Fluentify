"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { type FlashCard } from "@/common/api/services/vocabulary-set.service";
import { Separator } from "@/components/ui/separator";
import { Markdown } from "../markdown";
import { Input } from "../ui/input";
import DeleteButton from "../delete-button";
import { useFlashCardsStore } from "@/common/hooks/vocabulary-set/use-flash-cards-store";

interface FlashCardProps extends React.HTMLAttributes<HTMLDivElement> {
  flashCard: Omit<FlashCard, "vocabularySetId">;
  index: number;
}

export default function FlashCard(props: FlashCardProps) {
  const { flashCard, index, ...restOfProps } = props;
  const numberOfFlasCard = `${index}`;
  const {
    updateDefinitionOnChange,
    updateTranslationOnChange,
    flashCardsNumber,
    deleteFlashCard,
  } = useFlashCardsStore((state) => state);

  return (
    <Card {...restOfProps}>
      <CardHeader className="px-0 pt-2">
        <div className="flex items-center justify-between">
          <Markdown className="px-4">{numberOfFlasCard}</Markdown>
          <DeleteButton
            className="bg-none bg-inherit px-3 py-1 mr-2 my-1 hover:bg-secondary rounded-full"
            disabled={flashCardsNumber <= 2}
            onClick={() => deleteFlashCard(flashCard.id)}
          />
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-10 sm:flex sm:space-x-14 sm:space-y-0">
        <div className="w-full">
          <Input
            variant="secondary"
            defaultValue={flashCard.definition}
            onChange={(e) =>
              updateDefinitionOnChange(flashCard.id, e.target.value)
            }
          />
          <Markdown className="text-secondary-foreground text-sm pt-2.5">
            Definition
          </Markdown>
        </div>
        <div className="w-full">
          <Input
            variant="secondary"
            defaultValue={flashCard.translation}
            onChange={(e) =>
              updateTranslationOnChange(flashCard.id, e.target.value)
            }
          />
          <Markdown className="text-secondary-foreground text-sm pt-2.5">
            Translation
          </Markdown>
        </div>
      </CardContent>
    </Card>
  );
}
