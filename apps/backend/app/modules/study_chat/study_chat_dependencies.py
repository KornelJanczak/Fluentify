from fastapi import Depends
from langgraph_sdk import get_client
from langgraph_sdk.client import LangGraphClient
from openai import AsyncOpenAI
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.modules.error_analysis.error_analysis_repository import (
    StudyChatErrorAnalysisRepository,
)
from app.modules.flashcard_sets.flashcard_sets_dependencies import (
    get_flashcard_set_service,
)
from app.modules.flashcard_sets.flashcard_set_service import (
    FlashcardSetService,
)
from app.modules.study_chat.study_chat_history_service import (
    StudyChatHistoryService,
)
from app.modules.study_chat.study_chat_transcription_service import (
    StudyChatTranscriptionService,
)
from app.modules.study_chat.study_chat_tts_service import StudyChatTTSService
from app.modules.users.users_dependencies import oauth2_scheme


def get_openai_client() -> AsyncOpenAI:
    return AsyncOpenAI(api_key=settings.openai_api_key)


def get_study_chat_transcription_service(
    openai_client: AsyncOpenAI = Depends(get_openai_client),
) -> StudyChatTranscriptionService:
    return StudyChatTranscriptionService(openai_client)


def get_langgraph_client(
    token: str = Depends(oauth2_scheme),
) -> LangGraphClient:
    return get_client(
        url=settings.langgraph_api_url,
        headers={"Authorization": f"Bearer {token}"},
    )


def get_study_chat_error_analysis_repository(
    session: AsyncSession = Depends(get_db),
) -> StudyChatErrorAnalysisRepository:
    return StudyChatErrorAnalysisRepository(session)


def get_study_chat_history_service(
    flashcard_set_service: FlashcardSetService = Depends(
        get_flashcard_set_service
    ),
    error_analysis_repository: StudyChatErrorAnalysisRepository = Depends(
        get_study_chat_error_analysis_repository
    ),
) -> StudyChatHistoryService:
    return StudyChatHistoryService(
        flashcard_set_service,
        error_analysis_repository,
    )


def get_study_chat_tts_service() -> StudyChatTTSService:
    return StudyChatTTSService(cartesia_api_key=settings.cartesia_api_key)
