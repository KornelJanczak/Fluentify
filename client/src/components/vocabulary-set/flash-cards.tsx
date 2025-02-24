"use client";

import { type FlashCard } from "@/common/api/services/vocabulary-set.service";
import FlashCardComponent from "./flash-card";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { scaleAndFadeAnimation } from "@/common/animations";

export interface FlashCardsProps {
  flashCards: Omit<FlashCard, "vocabularySetId">[];
}

export default function FlashCards({ flashCards }: FlashCardsProps) {
  const isPresent = useIsPresent();

  return (
    <div className="flex flex-col space-y-4">
      <AnimatePresence>
        {flashCards.map((flashCard: FlashCard, index: number) => (
          <motion.div
            key={flashCard.id}
            layout
            {...scaleAndFadeAnimation(isPresent)}
          >
            <FlashCardComponent flashCard={flashCard} index={index + 1} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
