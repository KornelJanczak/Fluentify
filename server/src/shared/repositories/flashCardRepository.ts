import { db } from "../services/db";
import { type FlashCard, flashCards } from "../services/db/schema";
import { eq } from "drizzle-orm";
import DatabaseError from "../errors/dbError";
import NotFoundError from "@shared/errors/notFoundError";

export interface IFlashCardRepository {
  getFlashCardsByVocabularySetId(vocabularySetId: string): Promise<FlashCard[]>;
  create(newFlashCard: Omit<FlashCard, "id">): Promise<FlashCard>;
  deleteFlashCardById(flashCardId: string): Promise<void>;
  updateFlashCardById(flashCard: Partial<FlashCard>): Promise<FlashCard>;
}

class FlashCardRepository implements IFlashCardRepository {
  private readonly fileName = "flashCardRepository";

  async getFlashCardsByVocabularySetId(
    vocabularySetId: string
  ): Promise<FlashCard[]> {
    try {
      return await db
        .select()
        .from(flashCards)
        .where(eq(flashCards.vocabularySetId, vocabularySetId));
    } catch (error) {
      throw new DatabaseError({
        fileName: this.fileName,
        service: "getFlashCardsByVocabularySetId",
        message: error.message,
        stack: error.stack,
      });
    }
  }

  async create(newFlashCard: Omit<FlashCard, "id">): Promise<FlashCard> {
    try {
      const [createdFlashCard] = await db
        .insert(flashCards)
        .values(newFlashCard)
        .returning();

      return createdFlashCard;
    } catch (error) {
      throw new DatabaseError({
        fileName: this.fileName,
        service: "createFlashCard",
        message: error.message,
        stack: error.stack,
      });
    }
  }

  async deleteFlashCardById(flashCardId: string): Promise<void> {
    try {
      await db.delete(flashCards).where(eq(flashCards.id, flashCardId));
    } catch (error) {
      throw new DatabaseError({
        fileName: this.fileName,
        service: "deleteFlashCardById",
        message: error.message,
        stack: error.stack,
      });
    }
  }

  async updateFlashCardById(flashCard: Partial<FlashCard>): Promise<FlashCard> {
    if (!flashCard.id)
      throw new NotFoundError({
        message: "Flash card not found",
        fileName: this.fileName,
        service: "updateFlashCardById",
      });

    try {
      const [updatedFlashCard] = await db
        .update(flashCards)
        .set({ ...flashCard })
        .where(eq(flashCards.id, flashCard.id))
        .returning();

      return updatedFlashCard;
    } catch (error) {
      throw new DatabaseError({
        fileName: this.fileName,
        service: "updateFlashCardById",
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

export default FlashCardRepository;
