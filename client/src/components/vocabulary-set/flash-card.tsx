"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { FlashCard as FlashCardType } from "@/common/services/flash-card/flash-card.service";
import { Separator } from "@/components/ui/separator";
import { Markdown } from "../markdown";
import { Input } from "../ui/input";
import DeleteButton from "../delete-button";
import { useFlashCardsStore } from "@/common/hooks/use-flash-cards-store";

interface FlashCardProps extends React.HTMLAttributes<HTMLDivElement> {
  flashCard: Omit<FlashCardType, "vocabularySetId">;
  index: number;
  onDeleteFlashCard: (flashCardId: string) => void;
}

export default function FlashCard(props: FlashCardProps) {
  const { flashCard, index, onDeleteFlashCard, ...restOfProps } = props;
  const numberOfFlasCard = `${index}`;
  const {
    updateDefinitionOnChange,
    updateTranslationOnChange,
    deleteFlashCard,
  } = useFlashCardsStore((state) => state);

  return (
    <Card {...restOfProps}>
      <CardHeader className="px-0 pt-2">
        <div className="flex items-center justify-between">
          <Markdown className="px-4">{numberOfFlasCard}</Markdown>
          <DeleteButton onClick={() => deleteFlashCard(flashCard.id)} />
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="flex space-x-7">
        <Input
          onChange={(e) =>
            updateDefinitionOnChange(flashCard.id, e.target.value)
          }
          placeholder="Definition"
        />
        <Input
          onChange={(e) =>
            updateTranslationOnChange(flashCard.id, e.target.value)
          }
          placeholder="Translation"
        />
      </CardContent>
    </Card>
  );
}
