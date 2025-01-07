import { db } from "../services/db";
import { type FlashCard, flashCards } from "../services/db/schema";
import { eq } from "drizzle-orm";
import DatabaseError from "../errors/dbError";

export interface IFlashCardRepository {
  getFlashCardsByVocabularySetId(vocabularySetId: string): Promise<FlashCard>;
  create(newFlashCard: Omit<FlashCard, "id">): Promise<FlashCard>;
  deleteFlashCardById(flashCardId: string): Promise<void>;
}

class FlashCardRepository {
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
}

export default FlashCardRepository;
