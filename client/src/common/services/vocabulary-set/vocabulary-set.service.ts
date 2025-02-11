import { type FlashCard } from "../flash-card/flash-card.service";

export type VocabularySet = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  userId: string;
};

export type CreateVocabularySetRequest = Omit<
  VocabularySet,
  "id" | "userId" | "createdAt"
> & {
  flashCards: Omit<FlashCard, "id" | "vocabularySetId">[];
};

export type CreateVocabularySetResponse = {
  vocabularySetId: string;
};
