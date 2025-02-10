"use client";

import { FlashCard as FlashCardType } from "@/common/services/flash-card/flash-card.service";
import FlashCard from "./flash-card";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { scaleAndFadeAnimation } from "@/common/animations";

export interface FlashCardsProps {
  flashCards: Omit<FlashCardType, "vocabularySetId">[];
  onDeleteFlashCard: (flashCardId: string) => void;
}

export default function FlashCards({
  flashCards,
  onDeleteFlashCard,
}: FlashCardsProps) {
  const isPresent = useIsPresent();

  return (
    <div className="flex flex-col space-y-4">
      <AnimatePresence>
        {flashCards.map((flashCard: FlashCardType, index: number) => (
          <motion.div
            key={flashCard.id}
            layout
            {...scaleAndFadeAnimation(isPresent)}
          >
            <FlashCard
              flashCard={flashCard}
              index={index + 1}
              onDeleteFlashCard={onDeleteFlashCard}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
