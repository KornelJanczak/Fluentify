import {
  type VocabularySet,
  type VocabularySetWithoutId,
  vocabularySets,
  flashCards,
} from "@services/db/schema";
import { type FlashCard, type FlashCardWithoutIds } from "@services/db/schema";
import { db } from "@shared/services/db";
import DatabaseError from "@shared/errors/db.error";
import { eq } from "drizzle-orm";

export interface IVocabularySetRepository {
  createNewVocabularySet(
    newVocabularySet: VocabularySetWithoutId,
    flashCards: FlashCardWithoutIds[]
  ): Promise<VocabularySet>;
  getAllByUserId(userId: string): Promise<VocabularySet[]>;
}

class VocabularySetRepository implements IVocabularySetRepository {
  private readonly fileName = "vocabularySetRepository";
  async createNewVocabularySet(
    newVocabularySet: VocabularySetWithoutId,
    newFlashCards: FlashCardWithoutIds[]
  ): Promise<VocabularySet> {
    try {
      await db.transaction(async (tx) => {
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
      });

      const [createdItem] = await db
        .insert(vocabularySets)
        .values(newVocabularySet)
        .returning();

      return createdItem;
    } catch (error) {
      throw new DatabaseError({
        fileName: this.fileName,
        service: "create",
        message: error.message,
        stack: error.stack,
      });
    }
  }

  async getAllByUserId(userId: string): Promise<VocabularySet[]> {
    try {
      return await db
        .select()
        .from(vocabularySets)
        .where(eq(vocabularySets.userId, userId));
    } catch (error) {
      throw new DatabaseError({
        fileName: this.fileName,
        service: "getByUserId",
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

export default VocabularySetRepository;

export type CreateVocabularySetDTO = {
  title: string;
};
