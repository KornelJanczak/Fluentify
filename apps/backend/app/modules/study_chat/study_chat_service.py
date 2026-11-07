from collections.abc import AsyncIterator
from uuid import uuid4

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage

from app.infrastructure.ai.prompts import (
    INLINE_INSPECTOR_SYSTEM_PROMPT,
    STUDY_CHAT_SYSTEM_PROMPT,
)
from app.modules.error_analysis.error_analysis_schema import InlineInspectorSchema
from app.modules.error_analysis.error_analysis_model import (
    StudyChatErrorAnalysis,
)
from app.modules.error_analysis.error_analysis_repository import (
    StudyChatErrorAnalysisRepository,
)
from app.modules.flashcard_sets import FlashcardSetService
from app.modules.error_analysis.error_analysis_summary_service import (
    StudyChatAnalysisSummaryService,
)


class StudyChatService:
    def __init__(
        self,
        ai_client: BaseChatModel,
        flashcard_set_service: FlashcardSetService,
        error_analysis_repository: StudyChatErrorAnalysisRepository,
        analysis_summary_service: StudyChatAnalysisSummaryService,
        model_name: str,
        prompt_version: str,
    ):
        self.ai_client = ai_client
        self.flashcard_set_service = flashcard_set_service
        self.error_analysis_repository = error_analysis_repository
        self.analysis_summary_service = analysis_summary_service
        self.model_name = model_name
        self.prompt_version = prompt_version
        self.inline_inspector = ai_client.with_structured_output(
            InlineInspectorSchema
        )

    async def inspect_message(
        self,
        flashcard_set_id: str,
        message: str,
        user_id: str,
        language_level: str = "B2",
        thread_id: str | None = None,
    ) -> InlineInspectorSchema:
        flashcard_set = await self.flashcard_set_service.get_flashcard_set(
            flashcard_set_id, user_id
        )
        if flashcard_set is None:
            raise LookupError("Flashcard set not found")

        result = await self.inline_inspector.ainvoke(
            [
                SystemMessage(
                    content=INLINE_INSPECTOR_SYSTEM_PROMPT.format(
                        language_level=language_level,
                    )
                ),
                HumanMessage(content=message),
            ]
        )
        analysis = StudyChatErrorAnalysis(
            id=str(uuid4()),
            flashcard_set_id=flashcard_set_id,
            thread_id=thread_id,
            original_message=message,
            corrected_message=result.corrected_message,
            language_errors=[
                error.model_dump(mode="json") for error in result.errors
            ],
            language_level=language_level,
            model_name=self.model_name,
            prompt_version=self.prompt_version,
        )
        await self.error_analysis_repository.create(analysis)
        await self.error_analysis_repository.session.commit()

        return result

    async def stream_reply(
        self,
        flashcard_set_id: str,
        message: str,
        history: list[BaseMessage],
        user_id: str,
        language_level: str = "B2",
    ) -> AsyncIterator[str]:
        flashcard_set = await self.flashcard_set_service.get_flashcard_set(
            flashcard_set_id, user_id
        )

        if flashcard_set is None:
            raise LookupError("Flashcard set not found")

        analysis_summary = await self.analysis_summary_service.get_summary(
            flashcard_set_id
        )
        flashcard_context = "\n".join(
            f"- {flashcard.definition} ({flashcard.definition_translation}); "
            f"examples: {' | '.join(flashcard.ai_example_sentences)}"
            for flashcard in flashcard_set.flashcards
        )
        messages = [
            SystemMessage(
                content=STUDY_CHAT_SYSTEM_PROMPT.format(
                    language_level=language_level,
                    flashcard_context=flashcard_context,
                    analysis_summary=analysis_summary,
                )
            ),
            *history[-20:],
            HumanMessage(content=message),
        ]

        async for chunk in self.ai_client.astream(messages):
            if isinstance(chunk.content, str) and chunk.content:
                yield chunk.content
