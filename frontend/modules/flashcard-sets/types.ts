export type Flashcard = {
  id: string;
  definition: string;
  definition_translation: string;
  example_sentences: string[];
  language: string;
  flashcard_set_id: string;
};

export type FlashcardSet = {
  id: string;
  name: string;
  flashcard_count?: number;
};

export type FlashcardSetDetails = FlashcardSet & {
  flashcards: Flashcard[];
};

export type FlashcardDraft = {
  id?: string;
  definition: string;
  definition_translation: string;
  language: string;
  example_sentences: string[];
};
