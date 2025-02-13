export interface IFlashCardService {}

export interface FlashCard {
  id: string;
  definition: string;
  translation: string;
  vocabularySetId: string;
}
