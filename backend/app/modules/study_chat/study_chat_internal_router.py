from fastapi import APIRouter, Depends, HTTPException, status

from app.modules.flashcard_sets.flashcard_set_repository import (
    FlashcardSetRepository,
)
from app.modules.flashcard_sets.flashcard_set_service import FlashcardSetService
from app.modules.error_analysis.error_analysis_repository import (
    StudyChatErrorAnalysisRepository,
)
from app.modules.error_analysis.error_analysis_schema import (
    InlineInspectorSchema,
)
from app.modules.error_analysis.error_analysis_summary_service import (
    StudyChatAnalysisSummaryService,
)
from app.modules.study_chat.study_chat_internal_schema import (
    StudyChatContextResponseSchema,
    StudyChatInspectionRequestSchema,
)
from app.modules.study_chat.study_chat_internal_service import (
    StudyChatInternalService,
)
from app.modules.users.user_model import User
from app.modules.users.users_dependencies import get_current_user
from app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/internal/v1/study-chat",
                   tags=["study-chat-internal"])


def get_internal_service(
    session: AsyncSession = Depends(get_db),
) -> StudyChatInternalService:
    return StudyChatInternalService(
        FlashcardSetService(FlashcardSetRepository(session)),
        StudyChatAnalysisSummaryService(
            StudyChatErrorAnalysisRepository(session),
        ),
        StudyChatErrorAnalysisRepository(session),
    )


@router.get(
    "/{flashcard_set_id}/context",
    response_model=StudyChatContextResponseSchema,
)
async def get_study_chat_context(
    flashcard_set_id: str,
    current_user: User = Depends(get_current_user),
    service: StudyChatInternalService = Depends(get_internal_service),
) -> StudyChatContextResponseSchema:
    try:
        return await service.get_context(flashcard_set_id, current_user.id)
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.post(
    "/{flashcard_set_id}/inspection",
    response_model=InlineInspectorSchema,
)
async def persist_study_chat_inspection(
    flashcard_set_id: str,
    data: StudyChatInspectionRequestSchema,
    current_user: User = Depends(get_current_user),
    service: StudyChatInternalService = Depends(get_internal_service),
) -> InlineInspectorSchema:
    try:
        return await service.persist_inspection(
            flashcard_set_id,
            current_user.id,
            data,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error
