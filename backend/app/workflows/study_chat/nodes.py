from langchain_core.messages import AIMessage, HumanMessage
from langgraph.runtime import Runtime

from app.workflows.study_chat.dependencies import StudyChatWorkflowContext
from app.workflows.study_chat.state import StudyChatState


def _require_context(
    runtime: Runtime[StudyChatWorkflowContext],
) -> StudyChatWorkflowContext:
    if runtime.context is None:
        raise RuntimeError("Study chat workflow context is required")
    return runtime.context


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


async def generate_reply(
    state: StudyChatState,
    runtime: Runtime[StudyChatWorkflowContext],
) -> dict[str, object]:
    context = _require_context(runtime)
    user_message = _require_last_human_message(state)
    flashcard_set_id = _require_flashcard_set_id(state)
    if not isinstance(user_message.content, str):
        raise ValueError("Study chat messages must contain text content")

    response_parts: list[str] = []
    async for chunk in context.service.stream_reply(
        flashcard_set_id,
        user_message.content,
        state.get("messages", [])[:-1],
        state["user_id"],
        state.get("language_level", "B2"),
    ):
        response_parts.append(chunk)

    reply = "".join(response_parts)
    return {
        "reply": reply,
        "messages": [AIMessage(content=reply)],
    }


async def inspect_message(
    state: StudyChatState,
    runtime: Runtime[StudyChatWorkflowContext],
) -> dict[str, object]:
    context = _require_context(runtime)
    user_message = _require_last_human_message(state)
    flashcard_set_id = _require_flashcard_set_id(state)
    if not isinstance(user_message.content, str):
        raise ValueError("Study chat messages must contain text content")

    inspection = await context.service.inspect_message(
        flashcard_set_id,
        user_message.content,
        state["user_id"],
        state.get("language_level", "B2"),
        state.get("thread_id"),
    )
    return {"inline_inspector": inspection}
