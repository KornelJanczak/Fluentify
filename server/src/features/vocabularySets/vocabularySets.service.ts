import { type IVocabularySetRepository } from "@shared/repositories/vocabularySet.repository";
import { type ICreateVocabularySetArgs } from "./vocabularySets.interfaces";
import { v4 as uuid } from "uuid";
import {
  FlashCardWithoutIds,
  VocabularySetWithoutId,
  type FlashCard,
  type VocabularySet,
} from "@services/db/schema";
import NotFoundError from "@shared/errors/notFound.error";

class VocabularySetsService {
  private readonly vocabularySetRepository: IVocabularySetRepository;
  private readonly fileName = "vocabularySets.service";
  public async createVocabularySet(
    newVocabularySetData: ICreateVocabularySetArgs
  ) {
    const { vocabularySet, flashCards } =
      this.formatVocabularySetWithFlashCards(newVocabularySetData);

    const newVocabularySet =
      await this.vocabularySetRepository.createNewVocabularySet(
        vocabularySet,
        flashCards
      );

    if (!newVocabularySet) {
      throw new NotFoundError({
        fileName: this.fileName,
        service: "createVocabularySet",
        message: "Vocabulary set not created",
      });
    }

    return newVocabularySet;
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
