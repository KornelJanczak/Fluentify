import { type VocabularySet, vocabularySets } from "@shared/services/db/schema";
import { db } from "@shared/services/db";
import DatabaseError from "@shared/errors/dbError";
import { eq } from "drizzle-orm";

export interface IVocabularySetRepository {
  create(newItem: VocabularySet): Promise<VocabularySet>;
  getAllByUserId(userId: string): Promise<VocabularySet[]>;
}

class VocabularySetRepository implements IVocabularySetRepository {
  private readonly fileName = "vocabularySetRepository";
  async create(newItem: Omit<VocabularySet, "id">): Promise<VocabularySet> {
    try {
      const [createdItem] = await db
        .insert(vocabularySets)
        .values(newItem)
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
