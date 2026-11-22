import pytest
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import AIMessage, AIMessageChunk, HumanMessage
from langchain_core.outputs import ChatGenerationChunk

from chat_graph.backend_api import (
    FlashcardSetResponse,
    InlineInspectorSchema,
    LanguageError,
    LanguageErrorType,
    StudyChatContextResponse,
)
from chat_graph.dependencies import StudyChatWorkflowContext
from chat_graph.graph import build_study_chat_graph
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


class FakeChatModel:
    def __init__(self) -> None:
        self.invoked_messages = None

    async def ainvoke(self, messages):
        self.invoked_messages = messages
        return AIMessage(content="Hello learner")

    async def astream(self, _messages):
        raise AssertionError(
            "generate_reply should call ainvoke to enable LangGraph v2 stream events, not astream"
        )


class FakeInspectorModel:
    def with_structured_output(self, _schema):
        return self

    def with_config(self, **_kwargs):
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
    fake_chat_model = FakeChatModel()
    fake_inspector_model = FakeInspectorModel()
    context = StudyChatWorkflowContext(
        backend_api=backend_api,
        chat_ai_client=fake_chat_model,
        inline_inspector_ai_client=fake_inspector_model,
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
    fake_chat_model = FakeChatModel()
    fake_inspector_model = FakeInspectorModel()
    context = StudyChatWorkflowContext(
        backend_api=backend_api,
        chat_ai_client=fake_chat_model,
        inline_inspector_ai_client=fake_inspector_model,
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


class StreamingChatModel(BaseChatModel):
    def _generate(self, *args, **kwargs):
        raise NotImplementedError()

    async def _astream(self, messages, stop=None, run_manager=None, **kwargs):
        for piece in ["Hello", " ", "there", "!"]:
            chunk = ChatGenerationChunk(message=AIMessageChunk(content=piece))
            if run_manager:
                await run_manager.on_llm_new_token(piece, chunk=chunk)
            yield chunk

    def with_structured_output(self, _schema):
        return FakeInspectorModel()

    @property
    def _llm_type(self) -> str:
        return "streaming_fake"


@pytest.mark.asyncio
async def test_study_chat_graph_streams_v2_content_block_events() -> None:
    backend_api = FakeBackendApi()
    streaming_model = StreamingChatModel()
    inspector_model = FakeInspectorModel()
    context = StudyChatWorkflowContext(
        backend_api=backend_api,
        chat_ai_client=streaming_model,
        inline_inspector_ai_client=inspector_model,
        access_token="token-123",
        model_name="test-model",
        prompt_version="test-prompt-v1",
    )
    graph = build_study_chat_graph(context)
    state = {
        "messages": [HumanMessage(content="Hi")],
        "flashcard_set_id": "set-123",
    }

    deltas: list[str] = []
    stream = await graph.astream_events(state, version="v3")
    async with stream:
        async for event in stream:
            if event.get("method") == "messages":
                data = event.get("params", {}).get("data", {})
                if isinstance(data, tuple) and len(data) >= 1 and isinstance(data[0], dict):
                    event_dict = data[0]
                    if event_dict.get("event") == "content-block-delta":
                        deltas.append(event_dict.get("delta", {}).get("text", ""))

    assert deltas == ["Hello", " ", "there", "!"]

