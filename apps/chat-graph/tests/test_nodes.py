import pytest
from langchain_core.messages import AIMessage, HumanMessage

from chat_graph.backend_api import (
    FlashcardSetResponse,
    InlineInspectorSchema,
    LanguageError,
    LanguageErrorType,
    StudyChatContextResponse,
)
from chat_graph.dependencies import StudyChatWorkflowContext
from chat_graph.nodes import generate_reply, inspect_message
from chat_graph.state import StudyChatState


class FakeBackendApi:
    def __init__(self) -> None:
        self.persisted_request = None

    async def get_study_chat_context(self, _set_id: str, _token: str):
        return StudyChatContextResponse(
            flashcard_set=FlashcardSetResponse(
                id="set-123",
                name="Travel",
                flashcards=[],
            ),
            analysis_summary="No previous language analysis is available.",
        )

    async def persist_study_chat_inspection(
        self,
        _set_id: str,
        request,
        _token: str,
    ):
        self.persisted_request = request
        return request.inspection


class FakeStreamingModel:
    async def astream(self, _messages):
        yield AIMessage(content="Hello")
        yield AIMessage(content=" learner")

    def with_structured_output(self, _schema):
        return self

    async def ainvoke(self, _messages):
        return InlineInspectorSchema(
            original_message="I has a car.",
            corrected_message="I have a car.",
            errors=[
                LanguageError(
                    original_fragment="has",
                    corrected_fragment="have",
                    error_type=LanguageErrorType.GRAMMAR,
                    explanation="Use have with I.",
                ),
            ],
        )


@pytest.mark.asyncio
async def test_generate_reply_uses_backend_context_and_local_model() -> None:
    backend_api = FakeBackendApi()
    context = StudyChatWorkflowContext(
        backend_api=backend_api,
        ai_client=FakeStreamingModel(),
        access_token="token-123",
        model_name="test-model",
        prompt_version="test-prompt-v1",
    )
    state: StudyChatState = {
        "messages": [HumanMessage(content="What is a boarding pass?")],
        "flashcard_set_id": "set-123",
        "user_id": "user-123",
        "language_level": "B2",
    }

    result = await generate_reply(state, context)

    assert result["reply"] == "Hello learner"
    assert isinstance(result["messages"][0], AIMessage)


@pytest.mark.asyncio
async def test_inspect_message_persists_result_through_backend_api() -> None:
    backend_api = FakeBackendApi()
    context = StudyChatWorkflowContext(
        backend_api=backend_api,
        ai_client=FakeStreamingModel(),
        access_token="token-123",
        model_name="test-model",
        prompt_version="test-prompt-v1",
    )
    state: StudyChatState = {
        "messages": [HumanMessage(content="I has a car.")],
        "flashcard_set_id": "set-123",
        "thread_id": "study_chat:user-123:set-123",
        "inspection_request_id": "inspection-123",
        "language_level": "B2",
    }

    result = await inspect_message(state, context)

    assert result["inline_inspector"].corrected_message == "I have a car."
    assert backend_api.persisted_request.inspection_request_id == "inspection-123"
    assert backend_api.persisted_request.model_name == "test-model"
