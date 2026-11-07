from uuid import uuid4

from sqlalchemy.exc import IntegrityError

from app.modules.error_analysis.error_analysis_summary_service import (
    StudyChatAnalysisSummaryService,
)
from app.modules.error_analysis.error_analysis_model import (
    StudyChatErrorAnalysis,
)
from app.modules.error_analysis.error_analysis_repository import (
    StudyChatErrorAnalysisRepository,
)
from app.modules.error_analysis.error_analysis_schema import (
    InlineInspectorSchema,
)
from app.modules.flashcard_sets.flashcard_set_service import FlashcardSetService
from app.modules.study_chat.study_chat_internal_schema import (
    StudyChatContextResponseSchema,
    StudyChatInspectionRequestSchema,
)


class StudyChatInternalService:
    def __init__(
        self,
        flashcard_set_service: FlashcardSetService,
        analysis_summary_service: StudyChatAnalysisSummaryService,
        error_analysis_repository: StudyChatErrorAnalysisRepository,
    ):
        self.flashcard_set_service = flashcard_set_service
        self.analysis_summary_service = analysis_summary_service
        self.error_analysis_repository = error_analysis_repository

    async def get_context(
        self,
        flashcard_set_id: str,
        user_id: str,
    ) -> StudyChatContextResponseSchema:
        flashcard_set = await self.flashcard_set_service.get_flashcard_set(
            flashcard_set_id,
            user_id,
        )
        if flashcard_set is None:
            raise LookupError("Flashcard set not found")

        return StudyChatContextResponseSchema(
            flashcard_set=flashcard_set,
            analysis_summary=await self.analysis_summary_service.get_summary(
                flashcard_set_id,
            ),
        )

    async def persist_inspection(
        self,
        flashcard_set_id: str,
        user_id: str,
        data: StudyChatInspectionRequestSchema,
    ) -> InlineInspectorSchema:
        flashcard_set = await self.flashcard_set_service.get_flashcard_set(
            flashcard_set_id,
            user_id,
        )
        if flashcard_set is None:
            raise LookupError("Flashcard set not found")

        existing = await self.error_analysis_repository.get_by_inspection_request_id(
            data.inspection_request_id,
        )
        if existing is not None:
            if (
                existing.flashcard_set_id != flashcard_set_id
                or existing.original_message
                != data.inspection.original_message
            ):
                raise ValueError("Idempotency key was already used")
            return self._to_inspection(existing)

        analysis = StudyChatErrorAnalysis(
            id=str(uuid4()),
            flashcard_set_id=flashcard_set_id,
            thread_id=data.thread_id,
            inspection_request_id=data.inspection_request_id,
            original_message=data.inspection.original_message,
            corrected_message=data.inspection.corrected_message,
            language_errors=[
                error.model_dump(mode="json")
                for error in data.inspection.errors
            ],
            language_level=data.language_level,
            model_name=data.model_name,
            prompt_version=data.prompt_version,
        )
        try:
            async with self.error_analysis_repository.session.begin():
                await self.error_analysis_repository.create(analysis)
        except IntegrityError:
            existing = await self.error_analysis_repository.get_by_inspection_request_id(
                data.inspection_request_id,
            )
            if existing is None:
                raise
            if (
                existing.flashcard_set_id != flashcard_set_id
                or existing.original_message
                != data.inspection.original_message
            ):
                raise ValueError("Idempotency key was already used")
            return self._to_inspection(existing)

        return data.inspection

    @staticmethod
    def _to_inspection(
        analysis: StudyChatErrorAnalysis,
    ) -> InlineInspectorSchema:
        return InlineInspectorSchema(
            original_message=analysis.original_message,
            corrected_message=analysis.corrected_message,
            errors=analysis.language_errors,
        )
