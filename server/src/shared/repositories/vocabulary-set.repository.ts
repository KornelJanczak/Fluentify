import {
  type VocabularySet,
  type VocabularySetWithoutId,
  type FlashCard,
  type FlashCardWithoutIds,
  vocabularySets,
  flashCards,
} from '../db/db.schema';
import { Injectable, Inject } from '@nestjs/common';
import { ServiceError } from 'src/common/service-error';
import { and, count, eq, sql } from 'drizzle-orm';
import { Drizzle, DrizzleAsyncProvider } from '../db/db.provider';
import {
  FindOneByIdResponseDto,
  UpdateVocabularySetDto,
} from 'src/modules/vocabulary-set/vocabulary-set.dto';

@Injectable()
export class VocabularySetRepository {
  constructor(@Inject(DrizzleAsyncProvider) private db: Drizzle) {}

  public async create(
    newVocabularySet: VocabularySetWithoutId,
    newFlashCards: FlashCardWithoutIds[],
  ): Promise<string> {
    try {
      return await this.db.transaction(async (tx) => {
        const [{ id: vocabularySetId }] = await tx
          .insert(vocabularySets)
          .values(newVocabularySet)
          .returning({ id: vocabularySets.id });

        const flashCardsData: FlashCard[] = newFlashCards.map(
          (flashCard: FlashCard) => ({
            ...flashCard,
            vocabularySetId,
          }),
        );

        await tx.insert(flashCards).values(flashCardsData).returning();

        return vocabularySetId;
      });
    } catch (error) {
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }

  public async findAllByUserId(
    userId: string,
    page?: string,
    searchInput?: string,
  ): Promise<VocabularySetWithFlashCardsCount[]> {
    const itemsPerPage = 5;
    const offset = (parseInt(page) - 1) * itemsPerPage;

    console.log('offset', offset);

    try {
      return await this.db
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
              sql`to_tsvector('english', ${vocabularySets.title}) @@ to_tsquery('english', ${searchInput})`,
          ),
        )
        .leftJoin(flashCards, eq(flashCards.vocabularySetId, vocabularySets.id))
        .groupBy(vocabularySets.id);
    } catch (error) {
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }

  public async findOneById(id: string): Promise<FindOneByIdResponseDto> {
    try {
      return await this.db.query.vocabularySets.findFirst({
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
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }

  public async update(
    id: string,
    vocabularySet: UpdateVocabularySetDto,
  ): Promise<string> {
    try {
      return await this.db.transaction(async (tx) => {
        const [{ id: vocabularySetId }] = await tx
          .update(vocabularySets)
          .set({
            title: vocabularySet.title,
            description: vocabularySet.description,
          })
          .where(eq(vocabularySets.id, id))
          .returning({ id: vocabularySets.id });

        const flashCardUpdates = vocabularySet.flashCards.map((flashCard) =>
          tx
            .update(flashCards)
            .set(flashCard)
            .where(eq(flashCards.id, flashCard.id)),
        );

        await Promise.all(flashCardUpdates);

        return vocabularySetId;
      });
    } catch (error) {
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }

  public async deleteById(id: string): Promise<string> {
    try {
      return await this.db.transaction(async (tx) => {
        const [{ id: vocabularySetId }] = await tx
          .delete(vocabularySets)
          .where(eq(vocabularySets.id, id))
          .returning({ id: vocabularySets.id });

        await tx.delete(flashCards).where(eq(flashCards.vocabularySetId, id));

        return vocabularySetId;
      });
    } catch (error) {
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }

  public async findAllFlashCardsByVocabularySetId(
    id: string,
  ): Promise<FlashCard[]> {
    try {
      return await this.db.query.flashCards.findMany({
        where: eq(flashCards.vocabularySetId, id),
      });
    } catch (error) {
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }
}

export default VocabularySetRepository;

export type VocabularySetWithFlashCardsCount = VocabularySet & {
  flashCardsCount: number;
};

export type VocabularySetWithFlashCards = VocabularySet & {
  flashCards: Omit<FlashCard, 'vocabularySetId'>[];
};
