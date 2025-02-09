"use client";

import { Card, CardContent } from "../ui/card";
import { Markdown } from "../markdown";
import { Button } from "../ui/button";
import { FlashCardStore } from "@/common/hooks/use-flash-cards-set-create-new";

interface AddFlashCard extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  onAddFlashCard: () => void;
}

export default function AddFlashCard(props: AddFlashCard) {
  const { index, onAddFlashCard, ...restOfProps } = props;

  return (
    <Card {...restOfProps}>
      <CardContent>
        <div className="flex items-center justify-between">
          <Markdown className="px-4">{`${index}`}</Markdown>
          <Button onClick={onAddFlashCard}>ADD FLASHCARD</Button>
        </div>
      </CardContent>
    </Card>
  );
}
