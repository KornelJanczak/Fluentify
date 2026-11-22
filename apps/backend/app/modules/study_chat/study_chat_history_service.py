from collections.abc import Sequence

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage

from app.modules.error_analysis.error_analysis_repository import (
    StudyChatErrorAnalysisRepository,
)
from app.modules.error_analysis.error_analysis_schema import (
    InlineInspectorSchema,
)
from app.modules.study_chat.chat_schema import (
    StudyChatHistoryMessageSchema,
)
from app.modules.flashcard_sets import FlashcardSetService


def _extract_content_text(content: object) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts: list[str] = []
        for block in content:
            if isinstance(block, str):
                parts.append(block)
            elif isinstance(block, dict):
                text = block.get("text")
                if isinstance(text, str):
                    parts.append(text)
        return "".join(parts)
    return ""


class StudyChatHistoryService:
    def __init__(
        self,
        flashcard_set_service: FlashcardSetService,
        error_analysis_repository: StudyChatErrorAnalysisRepository,
    ):
        self.flashcard_set_service = flashcard_set_service
        self.error_analysis_repository = error_analysis_repository

    async def get_history(
        self,
        flashcard_set_id: str,
        user_id: str,
        thread_id: str,
        messages: Sequence[BaseMessage],
    ) -> list[StudyChatHistoryMessageSchema]:
        flashcard_set = await self.flashcard_set_service.get_flashcard_set(
            flashcard_set_id,
            user_id,
        )
        if flashcard_set is None:
            raise LookupError("Flashcard set not found")

        analyses = await self.error_analysis_repository.get_by_thread_id(
            thread_id
        )
        analysis_index = 0
        history: list[StudyChatHistoryMessageSchema] = []

        for message in messages:
            if isinstance(message, dict):
                role = message.get("role") or message.get("type")
                content = _extract_content_text(message.get("content", ""))
            elif isinstance(message, (HumanMessage, AIMessage)):
                role = "user" if isinstance(message, HumanMessage) else "assistant"
                content = _extract_content_text(message.content)
            else:
                continue

            if not content:
                continue

            inline_inspector = None
            if role in ("user", "human"):
                while analysis_index < len(analyses):
                    analysis = analyses[analysis_index]
                    analysis_index += 1
                    if analysis.original_message == content:
                        inline_inspector = InlineInspectorSchema(
                            original_message=analysis.original_message,
                            corrected_message=analysis.corrected_message,
                            errors=analysis.language_errors,
                        )
                        break

            history.append(
                StudyChatHistoryMessageSchema(
                    role="user" if role in ("user", "human") else "assistant",
                    content=content,
                    inline_inspector=inline_inspector,
                )
            )

        return history
