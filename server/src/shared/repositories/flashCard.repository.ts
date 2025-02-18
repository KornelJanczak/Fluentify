import { db } from "../services/db";
import { type FlashCard, flashCards } from "../services/db/schema";
import { eq } from "drizzle-orm";
import { ServiceError } from "@shared/errors/service.error";

export interface IFlashCardRepository {
  getFlashCardsByVocabularySetId(vocabularySetId: string): Promise<FlashCard[]>;
  create(newFlashCard: Omit<FlashCard, "id">): Promise<FlashCard>;
  deleteFlashCardById(flashCardId: string): Promise<void>;
  updateFlashCardById(flashCard: Partial<FlashCard>): Promise<FlashCard>;
}

class FlashCardRepository implements IFlashCardRepository {
  public async getFlashCardsByVocabularySetId(
    vocabularySetId: string
  ): Promise<FlashCard[]> {
    try {
      return await db
        .select()
        .from(flashCards)
        .where(eq(flashCards.vocabularySetId, vocabularySetId));
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async create(newFlashCard: Omit<FlashCard, "id">): Promise<FlashCard> {
    try {
      const [createdFlashCard] = await db
        .insert(flashCards)
        .values(newFlashCard)
        .returning();

      return createdFlashCard;
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async deleteFlashCardById(flashCardId: string): Promise<void> {
    try {
      await db.delete(flashCards).where(eq(flashCards.id, flashCardId));
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async updateFlashCardById(
    flashCard: Partial<FlashCard>
  ): Promise<FlashCard> {
    if (!flashCard.id)
      try {
        const [updatedFlashCard] = await db
          .update(flashCards)
          .set({ ...flashCard })
          .where(eq(flashCards.id, flashCard.id))
          .returning();

        return updatedFlashCard;
      } catch (error) {
        throw ServiceError.DatabaseError({
          message: error.message,
          stack: error.stack,
        });
      }
  }
}

export default FlashCardRepository;
