from langgraph_sdk.runtime import ServerRuntime
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph

from chat_graph.dependencies import (
    StudyChatWorkflowContext,
    create_workflow_context,
)
from chat_graph.nodes import generate_reply, inspect_message
from chat_graph.run_context import StudyChatRunContext
from chat_graph.state import StudyChatState


def build_study_chat_graph(
    dependencies: StudyChatWorkflowContext,
    checkpointer: AsyncPostgresSaver | None = None,
) -> CompiledStateGraph:
    builder = StateGraph[StudyChatState, StudyChatRunContext](
        StudyChatState,
    )

    def _ensure_access_token() -> None:
        if not dependencies.access_token:
            raise RuntimeError("Authenticated access token is required")

    async def reply_node(state, runtime):
        del runtime
        _ensure_access_token()
        return await generate_reply(state, dependencies)

    async def inspection_node(state, runtime):
        del runtime
        _ensure_access_token()
        return await inspect_message(state, dependencies)

    builder.add_node("generate_reply", reply_node)
    builder.add_node(
        "inspect_message",
        inspection_node,
        metadata={"tags": ["nostream"]},
    )
    builder.add_edge(START, "generate_reply")
    builder.add_edge("generate_reply", "inspect_message")
    builder.add_edge("inspect_message", END)
    return builder.compile(name="study_chat", checkpointer=checkpointer)


def _extract_access_token(user: object | None) -> str | None:
    if user is None:
        return None
    if hasattr(user, "get"):
        token = user.get("access_token")
        if isinstance(token, str) and token:
            return token
    token = getattr(user, "access_token", None)
    if isinstance(token, str) and token:
        return token
    return None


def make_study_chat_graph(
    runtime: ServerRuntime,
) -> CompiledStateGraph:
    access_token: str | None = None
    try:
        if hasattr(runtime, "ensure_user"):
            user = runtime.ensure_user()
            access_token = _extract_access_token(user)
    except Exception:
        access_token = None

    if not access_token:
        user = getattr(runtime, "user", None)
        access_token = _extract_access_token(user)

    return build_study_chat_graph(
        dependencies=create_workflow_context(access_token or ""),
    )
