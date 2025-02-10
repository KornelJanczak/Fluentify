"use client";

import * as React from "react";
import { Card, CardContent } from "../ui/card";
import { Markdown } from "../markdown";
import { Button } from "../ui/button";

interface AddFlashCard extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  onAddFlashCard: () => void;
}

export default function AddFlashCard(props: AddFlashCard) {
  const { index, onAddFlashCard, ...restOfProps } = props;
  const nextNumberOfFlashCard = `${index + 1}`;

  return (
    <Card className="" {...restOfProps}>
      <CardContent className="p-4">
        <div className="relative">
          <Markdown className="absolute  top-1/2  transform  -translate-y-1/2">
            {nextNumberOfFlashCard}
          </Markdown>
          <div className="flex justify-center items-center">
            <Button variant="secondary" onClick={onAddFlashCard}>
              ADD FLASHCARD
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
