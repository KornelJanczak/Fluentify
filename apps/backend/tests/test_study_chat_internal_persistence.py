from types import SimpleNamespace

import pytest

from app.modules.flashcards.flashcard_model import FlashCard
from app.modules.flashcard_sets.flashcard_set_model import FlashcardSet
from app.modules.error_analysis.error_analysis_schema import (
    InlineInspectorSchema,
    LanguageError,
    LanguageErrorType,
)
from app.modules.users.user_model import User
from app.modules.study_chat.study_chat_internal_schema import (
    StudyChatInspectionRequestSchema,
)
from app.modules.study_chat.study_chat_internal_service import (
    StudyChatInternalService,
)


class FakeTransaction:
    async def __aenter__(self) -> None:
        return None

    async def __aexit__(self, _exc_type, _exc_value, _traceback) -> None:
        return None


class FakeRepository:
    def __init__(self, in_transaction: bool = False) -> None:
        self._in_transaction = in_transaction
        self.committed = False
        self.session = SimpleNamespace(
            begin=lambda: FakeTransaction(),
            begin_nested=lambda: FakeTransaction(),
            commit=self._commit,
            in_transaction=lambda: self._in_transaction,
        )
        self.analysis = None

    async def _commit(self) -> None:
        self.committed = True

    async def get_by_inspection_request_id(self, _request_id: str):
        return self.analysis

    async def create(self, analysis):
        self.analysis = analysis
        return analysis


@pytest.mark.asyncio
async def test_persist_inspection_is_idempotent() -> None:
    repository = FakeRepository()
    service = StudyChatInternalService(
        flashcard_set_service=SimpleNamespace(
            get_flashcard_set=_get_flashcard_set,
        ),
        analysis_summary_service=SimpleNamespace(),
        error_analysis_repository=repository,
    )
    request = _inspection_request("I has a car.")

    first = await service.persist_inspection("set-123", "user-123", request)
    second = await service.persist_inspection("set-123", "user-123", request)

    assert first == second
    assert repository.analysis.original_message == "I has a car."

    conflicting_request = _inspection_request("I have a car.")
    with pytest.raises(ValueError, match="Idempotency key was already used"):
        await service.persist_inspection(
            "set-123",
            "user-123",
            conflicting_request,
        )

    with pytest.raises(ValueError, match="Idempotency key was already used"):
        await service.persist_inspection(
            "another-set",
            "user-123",
            request,
        )


@pytest.mark.asyncio
async def test_persist_inspection_when_transaction_already_in_progress() -> None:
    repository = FakeRepository(in_transaction=True)
    service = StudyChatInternalService(
        flashcard_set_service=SimpleNamespace(
            get_flashcard_set=_get_flashcard_set,
        ),
        analysis_summary_service=SimpleNamespace(),
        error_analysis_repository=repository,
    )
    request = _inspection_request("I has a car.")

    result = await service.persist_inspection("set-123", "user-123", request)

    assert result.original_message == "I has a car."
    assert repository.committed is True



async def _get_flashcard_set(
    _flashcard_set_id: str,
    _user_id: str,
) -> SimpleNamespace:
    return SimpleNamespace(id="set-123")


def _inspection_request(message: str) -> StudyChatInspectionRequestSchema:
    return StudyChatInspectionRequestSchema(
        inspection=InlineInspectorSchema(
            original_message=message,
            corrected_message="I have a car.",
            errors=[
                LanguageError(
                    original_fragment="has",
                    corrected_fragment="have",
                    error_type=LanguageErrorType.GRAMMAR,
                    explanation="Use have with I.",
                ),
            ],
        ),
        language_level="B2",
        thread_id="study_chat:user-123:set-123",
        inspection_request_id="inspection-123",
        model_name="test-model",
        prompt_version="test-prompt-v1",
    )
