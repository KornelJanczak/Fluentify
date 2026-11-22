from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.modules.flashcard_sets.flashcard_set_repository import (
    FlashcardSetRepository,
)
from app.modules.flashcard_sets.flashcard_set_service import (
    FlashcardSetService,
)
from app.modules.users.user_model import User
from app.modules.users.users_dependencies import get_current_user


def get_flashcard_set_repository(
    session: AsyncSession = Depends(get_db),
) -> FlashcardSetRepository:
    return FlashcardSetRepository(session)


def get_flashcard_set_service(
    repository: FlashcardSetRepository = Depends(get_flashcard_set_repository),
    _current_user: User = Depends(get_current_user),
) -> FlashcardSetService:
    return FlashcardSetService(repository)
