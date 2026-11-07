from uuid import uuid4

from app.modules.flashcards.flashcard_model import FlashCard
from app.modules.flashcard_sets.flashcard_set_model import FlashcardSet
from app.modules.flashcard_sets.flashcard_set_repository import (
    FlashcardSetRepository,
)
from app.modules.flashcard_sets.flashcard_set_schema import (
    CreateFlashcardSetSchema,
    UpdateFlashcardSetSchema,
)


class FlashcardSetService:
    def __init__(self, repository: FlashcardSetRepository):
        self.repository = repository

    async def create_flashcard_set(
        self,
        data: CreateFlashcardSetSchema,
        user_id: str,
    ) -> FlashcardSet:
        async with self.repository.session.begin():
            flashcard_set_id = str(uuid4())
            flashcard_set = FlashcardSet(
                id=flashcard_set_id,
                name=data.name,
                user_id=user_id,
            )
            flashcards = [
                FlashCard(
                    id=str(uuid4()),
                    definition=flashcard.definition,
                    definition_translation=flashcard.definition_translation,
                    ai_example_sentences=flashcard.example_sentences,
                    language=flashcard.language,
                    flashcard_set_id=flashcard_set_id,
                )
                for flashcard in data.flashcards
            ]
            flashcard_set.flashcards = flashcards

            return await self.repository.create_set_with_flashcards(
                flashcard_set,
                flashcards,
            )

    async def get_flashcard_set(
        self,
        flashcard_set_id: str,
        user_id: str,
    ) -> FlashcardSet | None:
        if self.repository.session.in_transaction():
            return await self.repository.get_flashcard_set_by_id(
                flashcard_set_id, user_id
            )

        async with self.repository.session.begin():
            return await self.repository.get_flashcard_set_by_id(
                flashcard_set_id, user_id
            )

    async def get_flashcard_sets(self, user_id: str) -> list[FlashcardSet]:
        return await self.repository.get_flashcard_sets(user_id)

    async def edit_flashcard_set(
        self,
        flashcard_set_id: str,
        data: UpdateFlashcardSetSchema,
        user_id: str,
    ) -> FlashcardSet | None:
        async with self.repository.session.begin():
            flashcard_set = await self.repository.get_flashcard_set_by_id(
                flashcard_set_id, user_id
            )
            if flashcard_set is None:
                return None

            for field, value in data.model_dump(exclude_unset=True).items():
                setattr(flashcard_set, field, value)

            await self.repository.session.flush()
            return flashcard_set

    async def delete_flashcard_set(self, flashcard_set_id: str, user_id: str) -> bool:
        async with self.repository.session.begin():
            flashcard_set = await self.repository.get_flashcard_set_by_id(
                flashcard_set_id, user_id
            )
            if flashcard_set is None:
                return False

            await self.repository.delete_flashcard_set(flashcard_set)
            return True

    async def get_flashcards(
        self,
        flashcard_set_id: str,
        user_id: str,
    ) -> list[FlashCard] | None:
        flashcard_set = await self.repository.get_flashcard_set_by_id(
            flashcard_set_id, user_id
        )
        if flashcard_set is None:
            return None

        return await self.repository.get_flashcards_by_set_id(flashcard_set_id, user_id)
