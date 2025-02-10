import { type IVocabularySetRepository } from "@shared/repositories/vocabularySet.repository";
import { type ICreateVocabularySetArgs } from "./vocabularySets.interfaces";
import { v4 as uuid } from "uuid";
import {
  FlashCardWithoutIds,
  VocabularySetWithoutId,
  type FlashCard,
  type VocabularySet,
} from "@services/db/schema";

class VocabularySetsService {
  private readonly vocabularySetRepository: IVocabularySetRepository;
  public async createVocabularySet(newVocabularySet: ICreateVocabularySetArgs) {
    const { vocabularySet, flashCards } =
      this.formatVocabularySetWithFlashCards(newVocabularySet);

    return await this.vocabularySetRepository.createNewVocabularySet(
      vocabularySet,
      flashCards
    );
  }

  private formatVocabularySetWithFlashCards({
    userId,
    title,
    description,
    flashCards,
  }: ICreateVocabularySetArgs): {
    vocabularySet: VocabularySetWithoutId;
    flashCards: FlashCardWithoutIds[];
  } {
    const formattedVocabularySet: Omit<VocabularySet, "id"> = {
      userId,
      createdAt: new Date(),
      title,
      description,
    };

    const formattedFlashCards = flashCards.map((flashCard: FlashCard) => ({
      createAt: new Date(),
      translation: flashCard.translation,
      definition: flashCard.definition,
      userId,
    }));

    return {
      vocabularySet: formattedVocabularySet,
      flashCards: formattedFlashCards,
    };
  }
}

export default VocabularySetsService;
