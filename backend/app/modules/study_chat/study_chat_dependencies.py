from fastapi import Depends, WebSocket
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.infrastructure.ai.client import create_ai_client
from app.infrastructure.ai.profiles import ENGLISH_CHAT_PROFILE
from app.infrastructure.ai.prompts import INLINE_INSPECTOR_PROMPT_VERSION
from app.modules.flashcard_sets import FlashcardSetService
from app.modules.flashcard_sets.flashcard_sets_dependencies import get_flashcard_set_service
from app.modules.flashcard_sets.flashcard_set_repository import (
    FlashcardSetRepository,
)
from app.modules.error_analysis.error_analysis_repository import (
    StudyChatErrorAnalysisRepository,
)
from app.modules.error_analysis.error_analysis_summary_service import (
    StudyChatAnalysisSummaryService,
)
from app.modules.study_chat.study_chat_service import StudyChatService
from app.modules.study_chat.study_chat_history_service import (
    StudyChatHistoryService,
)
from fastapi import Request
from langgraph.graph.state import CompiledStateGraph


def get_study_chat_error_analysis_repository(
    session: AsyncSession = Depends(get_db),
) -> StudyChatErrorAnalysisRepository:
    return StudyChatErrorAnalysisRepository(session)


def build_study_chat_service(session: AsyncSession) -> StudyChatService:
    flashcard_set_service = FlashcardSetService(
        FlashcardSetRepository(session)
    )
    error_analysis_repository = StudyChatErrorAnalysisRepository(session)
    analysis_summary_service = StudyChatAnalysisSummaryService(
        error_analysis_repository
    )
    return StudyChatService(
        create_ai_client(ENGLISH_CHAT_PROFILE),
        flashcard_set_service,
        error_analysis_repository,
        analysis_summary_service,
        ENGLISH_CHAT_PROFILE.model,
        INLINE_INSPECTOR_PROMPT_VERSION,
    )


def get_study_chat_service(
    flashcard_set_service: FlashcardSetService = Depends(
        get_flashcard_set_service
    ),
    error_analysis_repository: StudyChatErrorAnalysisRepository = Depends(
        get_study_chat_error_analysis_repository
    ),
) -> StudyChatService:
    analysis_summary_service = StudyChatAnalysisSummaryService(
        error_analysis_repository
    )
    return StudyChatService(
        create_ai_client(ENGLISH_CHAT_PROFILE),
        flashcard_set_service,
        error_analysis_repository,
        analysis_summary_service,
        ENGLISH_CHAT_PROFILE.model,
        INLINE_INSPECTOR_PROMPT_VERSION,
    )


def get_study_chat_websocket_service(
    session: AsyncSession = Depends(get_db),
) -> StudyChatService:
    return build_study_chat_service(session)


def get_study_chat_graph(
    request: Request,
) -> CompiledStateGraph:
    return request.app.state.study_chat_graph


def get_study_chat_websocket_graph(
    websocket: WebSocket,
) -> CompiledStateGraph:
    return websocket.app.state.study_chat_graph


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
