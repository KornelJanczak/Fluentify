from types import SimpleNamespace

import pytest

from app.modules.study_chat.study_chat_internal_service import (
    StudyChatInternalService,
)


@pytest.mark.asyncio
async def test_get_context_returns_flashcard_set_and_analysis_summary() -> None:
    async def get_flashcard_set(
        _flashcard_set_id: str,
        _user_id: str,
    ) -> SimpleNamespace:
        return SimpleNamespace(
            id="set-123",
            name="Travel",
            flashcards=[],
        )

    async def get_summary(_flashcard_set_id: str) -> str:
        return "No previous language analysis is available for this learner."

    flashcard_set_service = SimpleNamespace(
        get_flashcard_set=get_flashcard_set,
    )
    summary_service = SimpleNamespace(get_summary=get_summary)

    service = StudyChatInternalService(
        flashcard_set_service=flashcard_set_service,
        analysis_summary_service=summary_service,
        error_analysis_repository=SimpleNamespace(),
    )

    result = await service.get_context("set-123", "user-123")

    assert result.flashcard_set.id == "set-123"
    assert result.flashcard_set.name == "Travel"
    assert result.analysis_summary.startswith("No previous")
