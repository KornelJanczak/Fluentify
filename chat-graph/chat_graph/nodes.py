from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from chat_graph.backend_api import (
    InlineInspectorSchema,
    StudyChatInspectionRequest,
)
from chat_graph.dependencies import StudyChatWorkflowContext
from chat_graph.prompts import (
    INLINE_INSPECTOR_SYSTEM_PROMPT,
    STUDY_CHAT_SYSTEM_PROMPT,
)
from chat_graph.state import StudyChatState


def _require_last_human_message(state: StudyChatState) -> HumanMessage:
    for message in reversed(state.get("messages", [])):
        if isinstance(message, HumanMessage):
            return message
    raise ValueError("Study chat state must contain a human message")


def _require_flashcard_set_id(state: StudyChatState) -> str:
    flashcard_set_id = state.get("flashcard_set_id")
    if not flashcard_set_id:
        raise ValueError("Study chat state requires flashcard_set_id")
    return flashcard_set_id


def _require_inspection_request_id(state: StudyChatState) -> str:
    request_id = state.get("inspection_request_id")
    if not request_id:
        raise ValueError("Study chat state requires inspection_request_id")
    return request_id


def _format_flashcard_context(flashcards: list[object]) -> str:
    return "\n".join(
        f"- {flashcard.definition} ({flashcard.definition_translation}); "
        f"examples: {' | '.join(flashcard.example_sentences)}"
        for flashcard in flashcards
    )


async def generate_reply(
    state: StudyChatState,
    context: StudyChatWorkflowContext,
) -> dict[str, object]:
    user_message = _require_last_human_message(state)
    flashcard_set_id = _require_flashcard_set_id(state)
    if not isinstance(user_message.content, str):
        raise ValueError("Study chat messages must contain text content")

    study_context = await context.backend_api.get_study_chat_context(
        flashcard_set_id,
        context.access_token,
    )
    messages = [
        SystemMessage(
            content=STUDY_CHAT_SYSTEM_PROMPT.format(
                language_level=state.get("language_level", "B2"),
                flashcard_context=_format_flashcard_context(
                    study_context.flashcard_set.flashcards,
                ),
                analysis_summary=study_context.analysis_summary,
            ),
        ),
        *state.get("messages", [])[:-1][-20:],
        HumanMessage(content=user_message.content),
    ]

    response_parts: list[str] = []
    async for chunk in context.ai_client.astream(messages):
        if isinstance(chunk.content, str) and chunk.content:
            response_parts.append(chunk.content)

    reply = "".join(response_parts)
    return {
        "reply": reply,
        "messages": [AIMessage(content=reply)],
    }


async def inspect_message(
    state: StudyChatState,
    context: StudyChatWorkflowContext,
) -> dict[str, object]:
    user_message = _require_last_human_message(state)
    flashcard_set_id = _require_flashcard_set_id(state)
    inspection_request_id = _require_inspection_request_id(state)
    if not isinstance(user_message.content, str):
        raise ValueError("Study chat messages must contain text content")

    inspector = context.ai_client.with_structured_output(
        InlineInspectorSchema,
    )
    inspection = await inspector.ainvoke([
        SystemMessage(
            content=INLINE_INSPECTOR_SYSTEM_PROMPT.format(
                language_level=state.get("language_level", "B2"),
            ),
        ),
        HumanMessage(content=user_message.content),
    ])
    persisted_inspection = await context.backend_api.persist_study_chat_inspection(
        flashcard_set_id,
        StudyChatInspectionRequest(
            inspection=inspection,
            language_level=state.get("language_level", "B2"),
            thread_id=state.get("thread_id"),
            inspection_request_id=inspection_request_id,
            model_name=context.model_name,
            prompt_version=context.prompt_version,
        ),
        context.access_token,
    )
    return {"inline_inspector": persisted_inspection}
