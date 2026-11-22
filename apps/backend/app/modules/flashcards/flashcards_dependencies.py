from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.modules.flashcard_sets.flashcard_set_repository import (
    FlashcardSetRepository,
)
from app.modules.flashcards.flashcard_repository import FlashcardRepository
from app.modules.flashcards.flashcard_service import FlashcardService
from app.modules.flashcard_sets.flashcard_set_service import FlashcardSetService


def get_flashcard_repository(
    session: AsyncSession = Depends(get_db),
) -> FlashcardRepository:
    return FlashcardRepository(session)


def get_flashcard_set_repository(
    session: AsyncSession = Depends(get_db),
) -> FlashcardSetRepository:
    return FlashcardSetRepository(session)


def get_flashcard_service(
    repository: FlashcardRepository = Depends(get_flashcard_repository),
    flashcard_set_repository: FlashcardSetRepository = Depends(
        get_flashcard_set_repository
    ),
) -> FlashcardService:
    return FlashcardService(repository, flashcard_set_repository)


def get_flashcard_set_service(
    repository: FlashcardSetRepository = Depends(get_flashcard_set_repository),
) -> FlashcardSetService:
    return FlashcardSetService(repository)
