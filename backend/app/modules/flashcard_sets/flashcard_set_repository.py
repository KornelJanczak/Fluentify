from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.flashcards.flashcard_model import FlashCard
from app.modules.flashcard_sets.flashcard_set_model import FlashcardSet


class FlashcardSetRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_flashcard_set(
        self,
        flashcard_set: FlashcardSet,
    ) -> FlashcardSet:
        self.session.add(flashcard_set)
        await self.session.flush()
        return flashcard_set

    async def get_flashcard_set_by_id(
        self,
        flashcard_set_id: str,
        user_id: str,
    ) -> FlashcardSet | None:
        return await self.session.scalar(
            select(FlashcardSet)
            .options(selectinload(FlashcardSet.flashcards))
            .filter_by(id=flashcard_set_id, user_id=user_id)
        )

    async def get_flashcard_sets(self, user_id: str) -> list[FlashcardSet]:
        result = await self.session.execute(
            select(FlashcardSet, func.count(
                FlashCard.id).label("flashcard_count"))
            .outerjoin(FlashCard, FlashCard.flashcard_set_id == FlashcardSet.id)
            .where(FlashcardSet.user_id == user_id)
            .group_by(FlashcardSet.id)
        )
        flashcard_sets = []
        for flashcard_set, flashcard_count in result.all():
            flashcard_set.flashcard_count = flashcard_count
            flashcard_sets.append(flashcard_set)
        return flashcard_sets

    async def create_set_with_flashcards(
        self,
        flashcard_set: FlashcardSet,
        flashcards: list[FlashCard],
    ) -> FlashcardSet:
        self.session.add(flashcard_set)
        self.session.add_all(flashcards)

        await self.session.flush()
        return flashcard_set

    async def edit_flashcard_set(self, flashcard_set: FlashcardSet) -> FlashcardSet:
        merged_flashcard_set = await self.session.merge(flashcard_set)
        await self.session.flush()
        return merged_flashcard_set

    async def delete_flashcard_set(self, flashcard_set: FlashcardSet) -> None:
        await self.session.delete(flashcard_set)
        await self.session.flush()

    async def get_flashcards_by_set_id(
        self,
        flashcard_set_id: str,
        user_id: str,
    ) -> list[FlashCard]:
        result = await self.session.scalars(
            select(FlashCard)
            .join(FlashcardSet)
            .filter(
                FlashCard.flashcard_set_id == flashcard_set_id,
                FlashcardSet.user_id == user_id,
            )
        )

        return result.all()
