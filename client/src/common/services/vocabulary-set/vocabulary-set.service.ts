import { HttpError } from "@/common/services/api/rest-helper";
import { FlashCard } from "@/common/services/flash-card/flash-card.interfaces";
import { ServerAPI, serverApi } from "@/common/services/api/server-api";

interface IVocabularySetService {
  getVocabularySets(): Promise<VocabularySetResponse>;
  getVocabularySetDetails(id: string): Promise<VocabularySetDetailsResponse>;
}

const vocabularySetKey = ["vocabularySet"];

class VocabularySetService implements IVocabularySetService {
  public serverApi: ServerAPI;
  private BASIC_PATH = "/vocabulary-set";

  constructor(serverApi: ServerAPI) {
    this.serverApi = serverApi;
  }

  public async getVocabularySets(): Promise<VocabularySetResponse> {
    try {
      return (
        await this.serverApi.get<VocabularySetResponse>(this.BASIC_PATH, {
          next: { tags: [vocabularySetKey.join()] },
        })
      ).data;
    } catch (error) {
      if (!(error instanceof HttpError)) {
        throw error;
      }

      throw error;
    }
  }

  public async getVocabularySetDetails(
    id: string
  ): Promise<VocabularySetDetailsResponse> {
    try {
      return (
        await this.serverApi.get<VocabularySetDetailsResponse>(
          `${this.BASIC_PATH}/${id}`,
          {
            next: { tags: [vocabularySetKey.join()] },
          }
        )
      ).data;
    } catch (error) {
      if (!(error instanceof HttpError)) {
        throw error;
      }

      throw error;
    }
  }
}

export const vocabularySetService = new VocabularySetService(serverApi);

export type VocabularySet = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  userId: string;
  flashCardsCount: number;
};

export type VocabularySetWithFlashCards = Omit<
  VocabularySet,
  "flashCardsCount"
> & {
  flashCards: Omit<FlashCard, "vocabularySetId">[];
};

export type VocabularySetResponse = VocabularySet[] | null;

export type VocabularySetDetailsResponse = VocabularySetWithFlashCards | null;
