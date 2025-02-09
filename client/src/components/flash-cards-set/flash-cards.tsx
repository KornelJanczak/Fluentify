import { FlashCard as FlashCardType } from "@/common/services/flash-card/flash-card.service";
import FlashCard from "./flash-card";

export interface FlashCardsProps {
  flashCards: Omit<FlashCardType, "vocabularySetId">[];
  onDeleteFlashCard: (flashCardId: string) => void;
}

export default function FlashCards({
  flashCards,
  onDeleteFlashCard,
}: FlashCardsProps) {
  return (
    <>
      <div className="flex space-y-4">
        {flashCards.map((flashCard: FlashCardType, index: number) => (
          <FlashCard
            key={flashCard.id}
            flashCard={flashCard}
            index={index + 1}
            onDeleteFlashCard={onDeleteFlashCard}
          />
        ))}
      </div>
      <div>
        
      </div>
    </>
  );
}
