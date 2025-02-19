import {
  type VocabularySet,
  type VocabularySetWithoutId,
  vocabularySets,
  flashCards,
} from "@services/db/schema";
import { type FlashCard, type FlashCardWithoutIds } from "@services/db/schema";
import { db } from "@shared/services/db";
import { ServiceError } from "@shared/errors/service.error";
import { count, eq } from "drizzle-orm";

export interface IVocabularySetRepository {
  createNewVocabularySet(
    newVocabularySet: VocabularySetWithoutId,
    flashCards: FlashCardWithoutIds[]
  ): Promise<string>;
  getAllByUserId(userId: string): Promise<VocabularySetWithFlashCardsCount[]>;
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
}

export default VocabularySetRepository;

export type VocabularySetWithFlashCardsCount =
  VocabularySet & {
    flashCardsCount: number;
  }

