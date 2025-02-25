import { FlashCardStore } from "@/common/hooks/use-flash-cards-store";
import { toast } from "sonner";
export const validateFlashCards = (flashCards: FlashCardStore[]): boolean => {
  const validFlashCards = flashCards.filter(
    (flashCard) =>
      flashCard.definition.trim().length >= 2 &&
      flashCard.translation.trim().length >= 2
  );

  if (validFlashCards.length < 2) {
    toast.error(
      "There must be at least 2 flash cards with valid definitions and translations."
    );
    return false;
  }

  return true;
};
