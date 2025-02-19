import {
  VocabularySetWithFlashCardsCount,
  type IVocabularySetRepository,
} from "@shared/repositories/vocabularySet.repository";
import {
  IVocabularySetsService,
  IVocabularySetsServiceDependencies,
  type ICreateVocabularySetArgs,
} from "./vocabularySets.interfaces";
import {
  FlashCardWithoutIds,
  VocabularySetWithoutId,
  type FlashCard,
  type VocabularySet,
} from "@services/db/schema";
import { ServiceError } from "@shared/errors/service.error";

class VocabularySetsService implements IVocabularySetsService {
  private readonly vocabularySetRepository: IVocabularySetRepository;

  constructor({ vocabularySetRepository }: IVocabularySetsServiceDependencies) {
    this.vocabularySetRepository = vocabularySetRepository;
  }
  public async createVocabularySet(
    newVocabularySetData: ICreateVocabularySetArgs
  ): Promise<string> {
    const { vocabularySet, flashCards } =
      this.formatVocabularySetWithFlashCards(newVocabularySetData);

    const vocabularySetId =
      await this.vocabularySetRepository.createNewVocabularySet(
        vocabularySet,
        flashCards
      );

    if (!vocabularySetId) {
      throw ServiceError.NotFound({
        message: "Vocabulary set not created",
      });
    }

    return vocabularySetId;
  }

  public async getAllVocabularySetsByUserId(
    userId: string
  ): Promise<VocabularySetWithFlashCardsCount[]> {
    const vocabularySets = await this.vocabularySetRepository.getAllByUserId(
      userId
    );

    if (!vocabularySets) {
      throw ServiceError.NotFound({
        message: "Vocabulary sets not found",
      });
    }

    return vocabularySets;
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
