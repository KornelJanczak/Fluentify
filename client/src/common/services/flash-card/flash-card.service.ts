interface IFlashCardService {}

class FlashCardService implements IFlashCardService {}

export const flashCardService = new FlashCardService();

export type FlashCard = {
  id: string;
  definition: string;
  translation: string;
  vocabularySetId: string;
};

export type FlashCardsResponse = FlashCard[] | null;
