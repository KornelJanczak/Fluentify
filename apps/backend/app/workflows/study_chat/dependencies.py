from collections.abc import AsyncIterator
from dataclasses import dataclass
from typing import Protocol

from langchain_core.messages import BaseMessage

from app.modules.error_analysis.error_analysis_schema import InlineInspectorSchema


class StudyChatBusinessClient(Protocol):
    async def inspect_message(
        self,
        flashcard_set_id: str,
        message: str,
        user_id: str,
        language_level: str = "B2",
        thread_id: str | None = None,
    ) -> InlineInspectorSchema:
        ...

    def stream_reply(
        self,
        flashcard_set_id: str,
        message: str,
        history: list[BaseMessage],
        user_id: str,
        language_level: str = "B2",
    ) -> AsyncIterator[str]:
        ...


@dataclass(frozen=True)
class StudyChatWorkflowContext:
    service: StudyChatBusinessClient
