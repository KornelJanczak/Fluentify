from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from typing import TypedDict

from app.modules.flashcards.flashcard_model import FlashCard
from app.modules.flashcard_sets.flashcard_set_model import FlashcardSet

class FlashCardUpdateDict(TypedDict):
    id: str
    ai_example_sentences: list[str]


class FlashcardRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_flashcard(self, flashcard: FlashCard) -> FlashCard:
        self.session.add(flashcard)
        await self.session.flush()
        return flashcard

    async def update_example_sentences(
        self,
        updates: list[FlashCardUpdateDict],
        user_id: str,
    ) -> None:
        for update_data in updates:
            await self.session.execute(
                update(FlashCard)
                .where(
                    FlashCard.id == update_data["id"],
                    FlashCard.flashcard_set_id == FlashcardSet.id,
                    FlashcardSet.user_id == user_id,
                )
                .values(ai_example_sentences=update_data["ai_example_sentences"])
            )
        await self.session.flush()

    async def get_flashcard_by_id(
        self,
        flashcard_id: str,
        user_id: str,
    ) -> FlashCard | None:
        return await self.session.scalar(
            select(FlashCard)
            .join(FlashcardSet)
            .where(FlashCard.id == flashcard_id, FlashcardSet.user_id == user_id)
        )

    async def edit_flashcard(self, flashcard: FlashCard) -> FlashCard:
        merged_flashcard = await self.session.merge(flashcard)
        await self.session.flush()
        return merged_flashcard

    async def delete_flashcard(self, flashcard: FlashCard) -> None:
        await self.session.delete(flashcard)
        await self.session.flush()
