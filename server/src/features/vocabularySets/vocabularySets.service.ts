import type {
  VocabularySetWithFlashCardsCount,
  IVocabularySetRepository,
  VocabularySetWithFlashCards,
} from "@shared/repositories/vocabularySet.repository";
import type {
  IVocabularySetsService,
  IVocabularySetsServiceDependencies,
  ICreateVocabularySetArgs,
  IGetAllVocabularySetsArgs,
} from "./vocabularySets.interfaces";
import type {
  FlashCardWithoutIds,
  VocabularySetWithoutId,
  FlashCard,
  VocabularySet,
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
    userId: string,
    page?: string,
    searchInput?: string
  ): Promise<IGetAllVocabularySetsArgs> {
    const itemsPerPage = 5;

    const vocabularySets = await this.vocabularySetRepository.getAllByUserId(
      userId,
      page,
      searchInput
    );

    if (!vocabularySets) {
      throw ServiceError.NotFound({
        message: "Vocabulary sets not found",
      });
    }

    const hasMore = vocabularySets.length > itemsPerPage;

    const paginatedResults = hasMore
      ? vocabularySets.slice(0, itemsPerPage)
      : vocabularySets;

    return { vocabularySets: paginatedResults, hasMore };
  }

  public async getVocabularySetWithFlashCardsById(
    id: string
  ): Promise<VocabularySetWithFlashCards> {
    const vocabularySet =
      await this.vocabularySetRepository.getWithFlashCardsById(id);

    if (!vocabularySet) {
      throw ServiceError.NotFound({
        message: "Vocabulary set not found",
      });
    }

    return vocabularySet;
  }

  public async updateVocabularySet(
    id: string,
    vocabularySet: VocabularySetWithFlashCards
  ): Promise<string> {
    const updatedVocabularySetId =
      await this.vocabularySetRepository.updateVocabularySet(id, vocabularySet);

    if (!updatedVocabularySetId)
      throw ServiceError.NotFound({
        message: "Vocabulary set not updated",
      });

    return updatedVocabularySetId;
  }

  public async deleteVocabularySet(id: string): Promise<string> {
    await this.vocabularySetRepository.deleteVocabularySetById(id);
    return id;
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
