from fastapi import Depends

from app.infrastructure.ai.client import create_ai_client
from app.infrastructure.ai.profiles import FLASHCARD_EXAMPLES_PROFILE
from app.modules.example_sentences.example_sentence_service import (
    AiExampleSentenceGenerator,
)
from app.modules.flashcard_sets.flashcard_set_service import FlashcardSetService
from app.modules.flashcards.flashcard_service import FlashcardService
from app.modules.flashcards.flashcards_dependencies import (
    get_flashcard_service,
    get_flashcard_set_service,
)


def get_example_sentence_generator(
    flashcard_set_service: FlashcardSetService = Depends(
        get_flashcard_set_service
    ),
    flashcard_service: FlashcardService = Depends(get_flashcard_service),
) -> AiExampleSentenceGenerator:
    ai_client = create_ai_client(FLASHCARD_EXAMPLES_PROFILE)
    return AiExampleSentenceGenerator(
        ai_client,
        flashcard_set_service,
        flashcard_service,
    )
