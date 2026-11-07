from uuid import uuid4

from app.modules.flashcards.flashcard_model import FlashCard
from app.modules.flashcards.flashcard_repository import (
    FlashcardRepository,
)
from app.modules.flashcard_sets.flashcard_set_repository import (
    FlashcardSetRepository,
)
from app.modules.flashcards.flashcard_schema import (
    CreateFlashcardSchema,
    UpdateFlashcardSchema,
)
from app.modules.flashcards.flashcard_repository import (
    FlashCardUpdateDict,
)


class FlashcardService:
    def __init__(
        self,
        repository: FlashcardRepository,
        flashcard_set_repository: FlashcardSetRepository,
    ):
        self.repository = repository
        self.flashcard_set_repository = flashcard_set_repository

    async def create_flashcard(
        self,
        data: CreateFlashcardSchema,
        user_id: str,
    ) -> FlashCard | None:
        async with self.repository.session.begin():
            flashcard_set = await self.flashcard_set_repository.get_flashcard_set_by_id(
                data.flashcard_set_id, user_id
            )
            if flashcard_set is None:
                return None

            flashcard = FlashCard(
                id=str(uuid4()),
                definition=data.definition,
                definition_translation=data.definition_translation,
                ai_example_sentences=data.example_sentences,
                language=data.language,
                flashcard_set_id=data.flashcard_set_id,
            )

            return await self.repository.create_flashcard(flashcard)

    async def update_flashcards(
        self,
        updates: list[FlashCardUpdateDict],
        user_id: str,
    ) -> None:
        async with self.repository.session.begin():
            await self.repository.update_example_sentences(updates, user_id)

    async def get_flashcard(self, flashcard_id: str, user_id: str) -> FlashCard | None:
        return await self.repository.get_flashcard_by_id(flashcard_id, user_id)

    async def edit_flashcard(
        self,
        flashcard_id: str,
        data: UpdateFlashcardSchema,
        user_id: str,
    ) -> FlashCard | None:
        async with self.repository.session.begin():
            flashcard = await self.repository.get_flashcard_by_id(flashcard_id, user_id)
            if flashcard is None:
                return None

            updates = data.model_dump(exclude_unset=True)
            for field, value in updates.items():
                setattr(flashcard, field, value)

            await self.repository.session.flush()
            return flashcard

    async def delete_flashcard(self, flashcard_id: str, user_id: str) -> bool:
        async with self.repository.session.begin():
            flashcard = await self.repository.get_flashcard_by_id(flashcard_id, user_id)
            if flashcard is None:
                return False

            await self.repository.delete_flashcard(flashcard)
            return True
