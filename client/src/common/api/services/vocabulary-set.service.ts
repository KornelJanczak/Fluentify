import { HttpError } from "@/common/api/rest-helper";
import { ServerAPI, serverApi } from "@/common/api/server-api";

interface IVocabularySetService {
  getVocabularySets(page: string): Promise<VocabularySetResponse>;
  getVocabularySetDetails(id: string): Promise<VocabularySetDetailsResponse>;
}

const vocabularySetKey = ["vocabularySet"];

class VocabularySetService implements IVocabularySetService {
  public serverApi: ServerAPI;
  private BASIC_PATH = "/vocabulary-set";

  constructor(serverApi: ServerAPI) {
    this.serverApi = serverApi;
  }

  public async getVocabularySets(
    page?: string,
    searchInput?: string
  ): Promise<VocabularySetResponse> {
    const PATH = `${this.BASIC_PATH}s/${page ? page : 1}${
      searchInput ? `/${searchInput}` : ""
    }`;

    try {
      return (
        await this.serverApi.get<VocabularySetResponse>(PATH, {
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

export type FlashCard = {
  id: string;
  definition: string;
  translation: string;
  vocabularySetId: string;
};

export type VocabularySetWithFlashCards = Omit<
  VocabularySet,
  "flashCardsCount"
> & {
  flashCards: Omit<FlashCard, "vocabularySetId">[];
};

export type VocabularySetResponse = {
  vocabularySets: VocabularySet[];
  hasMore: boolean;
} | null;

export type VocabularySetDetailsResponse = VocabularySetWithFlashCards | null;
