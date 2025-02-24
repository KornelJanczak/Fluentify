"use client";

import * as React from "react";
import { Card, CardContent } from "../ui/card";
import { Markdown } from "../markdown";
import { Button } from "../ui/button";
import { useFlashCardsStore } from "@/common/hooks/use-flash-cards-store";

interface AddFlashCard extends React.HTMLAttributes<HTMLDivElement> {}

export default function AddFlashCard(props: AddFlashCard) {
  const { addFlashCard, flashCardsNumber } = useFlashCardsStore(
    (state) => state
  );

  const nextNumberOfFlashCard = `${flashCardsNumber + 1}`;

  return (
    <Card className="" {...props}>
      <CardContent className="p-4">
        <div className="relative">
          <Markdown className="absolute  top-1/2  transform  -translate-y-1/2">
            {nextNumberOfFlashCard}
          </Markdown>
          <div className="flex justify-center items-center">
            <Button variant="secondary" onClick={addFlashCard}>
              ADD FLASHCARD
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
