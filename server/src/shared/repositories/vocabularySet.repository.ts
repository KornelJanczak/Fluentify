import {
  type VocabularySet,
  type VocabularySetWithoutId,
  vocabularySets,
  flashCards,
  users,
} from "@services/db/schema";
import { type FlashCard, type FlashCardWithoutIds } from "@services/db/schema";
import { db } from "@shared/services/db";
import { ServiceError } from "@shared/errors/service.error";
import { count, eq } from "drizzle-orm";
import { chats } from "drizzle/schema";

export interface IVocabularySetRepository {
  createNewVocabularySet(
    newVocabularySet: VocabularySetWithoutId,
    flashCards: FlashCardWithoutIds[]
  ): Promise<string>;
  getAllByUserId(userId: string): Promise<VocabularySetWithFlashCardsCount[]>;
  getWithFlashCardsById(id: string): Promise<VocabularySetWithFlashCards>;
}

class VocabularySetRepository implements IVocabularySetRepository {
  public async createNewVocabularySet(
    newVocabularySet: VocabularySetWithoutId,
    newFlashCards: FlashCardWithoutIds[]
  ): Promise<string> {
    try {
      return await db.transaction(async (tx) => {
        const [vocabularySet] = await tx
          .insert(vocabularySets)
          .values(newVocabularySet)
          .returning({ id: vocabularySets.id });

        const flashCardsData: FlashCard[] = newFlashCards.map(
          (flashCard: FlashCard) => ({
            ...flashCard,
            vocabularySetId: vocabularySet.id,
          })
        );

        await tx.insert(flashCards).values(flashCardsData).returning();

        return vocabularySet.id;
      });
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async getAllByUserId(
    userId: string
  ): Promise<VocabularySetWithFlashCardsCount[]> {
    try {
      return await db
        .select({
          id: vocabularySets.id,
          title: vocabularySets.title,
          description: vocabularySets.description,
          createdAt: vocabularySets.createdAt,
          userId: vocabularySets.userId,
          flashCardsCount: count(flashCards.id),
        })
        .from(vocabularySets)
        .where(eq(vocabularySets.userId, userId))
        .leftJoin(flashCards, eq(flashCards.vocabularySetId, vocabularySets.id))
        .groupBy(vocabularySets.id);
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async getWithFlashCardsById(
    id: string
  ): Promise<VocabularySetWithFlashCards> {
    try {
      // const result = await db.query.vocabularySets.findFirst({
      //   where: eq(vocabularySets.id, id),
      //   with: {
      //     flashCards: true,
      //   },
      // });

      // console.log("result", result);

      const user = await db.query.users.findFirst({
        where: eq(users.id, "104257642802966296935"),

      });

      console.log('user', user);
      

      //@ts-ignore
      return result;
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

export default VocabularySetRepository;

export type VocabularySetWithFlashCardsCount = VocabularySet & {
  flashCardsCount: number;
};

export type VocabularySetWithFlashCards = VocabularySet & {
  flashCards: Omit<FlashCard, "vocabularySetId">;
};
