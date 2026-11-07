from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response

from app.modules.example_sentences.example_sentence_dependencies import (
    get_example_sentence_generator,
)
from app.modules.example_sentences.example_sentence_schema import (
    GeneratedExamplesSchema,
)
from app.modules.flashcards.flashcard_schema import (
    CreateFlashcardSchema,
    FlashcardResponseSchema,
    UpdateFlashcardSchema,
)
from app.modules.example_sentences.example_sentence_service import (
    AiExampleSentenceGenerator,
)
from app.modules.flashcards.flashcards_dependencies import get_flashcard_service
from app.modules.flashcards.flashcard_service import FlashcardService
from app.modules.users.user_model import User
from app.modules.users.users_dependencies import get_current_user

router = APIRouter(prefix="/flashcards", tags=["flashcards"])


@router.post("/{flashcard_set_id}/examples")
async def generate_example_sentences(
    flashcard_set_id: str,
    generator: AiExampleSentenceGenerator = Depends(
        get_example_sentence_generator
    ),
    current_user: User = Depends(get_current_user),
) -> list[GeneratedExamplesSchema]:
    example_sentences = await generator.generate_example_sentences(
        flashcard_set_id, current_user.id
    )

    if example_sentences is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard set not found",
        )

    return example_sentences


@router.post(
    "",
    response_model=FlashcardResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
async def create_flashcard(
    data: CreateFlashcardSchema,
    service: FlashcardService = Depends(get_flashcard_service),
    current_user: User = Depends(get_current_user),
) -> FlashcardResponseSchema:
    flashcard = await service.create_flashcard(data, current_user.id)
    if flashcard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard set not found",
        )

    return flashcard


@router.get(
    "/{flashcard_id}",
    response_model=FlashcardResponseSchema,
)
async def get_flashcard(
    flashcard_id: str,
    service: FlashcardService = Depends(get_flashcard_service),
    current_user: User = Depends(get_current_user),
) -> FlashcardResponseSchema:
    flashcard = await service.get_flashcard(flashcard_id, current_user.id)
    if flashcard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found",
        )

    return flashcard


@router.patch(
    "/{flashcard_id}",
    response_model=FlashcardResponseSchema,
)
async def edit_flashcard(
    flashcard_id: str,
    data: UpdateFlashcardSchema,
    service: FlashcardService = Depends(get_flashcard_service),
    current_user: User = Depends(get_current_user),
) -> FlashcardResponseSchema:
    flashcard = await service.edit_flashcard(flashcard_id, data, current_user.id)
    if flashcard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found",
        )

    return flashcard


@router.delete(
    "/{flashcard_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_flashcard(
    flashcard_id: str,
    service: FlashcardService = Depends(get_flashcard_service),
    current_user: User = Depends(get_current_user),
) -> Response:
    deleted = await service.delete_flashcard(flashcard_id, current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)
