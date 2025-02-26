import {
  type VocabularySet,
  type VocabularySetWithoutId,
  vocabularySets,
  flashCards,
} from "@services/db/schema";
import { type FlashCard, type FlashCardWithoutIds } from "@services/db/schema";
import { db } from "@shared/services/db";
import { ServiceError } from "@shared/errors/service.error";
import { and, count, eq, or, sql } from "drizzle-orm";

export interface IVocabularySetRepository {
  createNewVocabularySet(
    newVocabularySet: VocabularySetWithoutId,
    flashCards: FlashCardWithoutIds[]
  ): Promise<string>;
  getAllByUserId(
    userId: string,
    page?: string,
    searchInput?: string
  ): Promise<VocabularySetWithFlashCardsCount[]>;
  getWithFlashCardsById(id: string): Promise<VocabularySetWithFlashCards>;
  updateVocabularySet(
    id: string,
    vocabularySet: VocabularySetWithFlashCards
  ): Promise<string>;
  deleteVocabularySetById(id: string): Promise<void>;
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
    userId: string,
    page?: string,
    searchInput?: string
  ): Promise<VocabularySetWithFlashCardsCount[]> {
    const itemsPerPage = 5;
    const offset = (parseInt(page) - 1) * itemsPerPage;

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
        .limit(itemsPerPage + 1)
        .offset(offset)
        .where(
          and(
            eq(vocabularySets.userId, userId),
            searchInput &&
              sql`to_tsvector('english', ${vocabularySets.title}) @@ to_tsquery('english', ${searchInput})`
          )
        )
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
      return await db.query.vocabularySets.findFirst({
        where: eq(vocabularySets.id, id),
        with: {
          flashCards: {
            columns: {
              id: true,
              definition: true,
              translation: true,
            },
          },
        },
      });
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async updateVocabularySet(
    id: string,
    vocabularySet: VocabularySetWithFlashCards
  ): Promise<string> {
    try {
      return await db.transaction(async (tx) => {
        const [updatedVocabularySet] = await tx
          .update(vocabularySets)
          .set({
            title: vocabularySet.title,
            description: vocabularySet.description,
          })
          .where(eq(vocabularySets.id, id))
          .returning();
        for (const flashCard of vocabularySet.flashCards) {
          await tx
            .update(flashCards)
            .set(flashCard)
            .where(eq(flashCards.id, flashCard.id));
        }

        return updatedVocabularySet.id;
      });
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async deleteVocabularySetById(id: string): Promise<void> {
    try {
      await db.transaction(async (tx) => {
        await tx.delete(vocabularySets).where(eq(vocabularySets.id, id));
        await tx.delete(flashCards).where(eq(flashCards.vocabularySetId, id));
      });
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
  flashCards: Omit<FlashCard, "vocabularySetId">[];
};
