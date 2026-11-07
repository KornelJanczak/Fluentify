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

    async def reply_node(state, runtime):
        del runtime
        return await generate_reply(state, dependencies)

    async def inspection_node(state, runtime):
        del runtime
        return await inspect_message(state, dependencies)

    builder.add_node("generate_reply", reply_node)
    builder.add_node("inspect_message", inspection_node)
    builder.add_edge(START, "generate_reply")
    builder.add_edge("generate_reply", "inspect_message")
    builder.add_edge("inspect_message", END)
    return builder.compile(name="study_chat", checkpointer=checkpointer)


def make_study_chat_graph(
    runtime: ServerRuntime,
) -> CompiledStateGraph:
    user = runtime.ensure_user()
    access_token = user.get("access_token")
    if not isinstance(access_token, str) or not access_token:
        raise RuntimeError("Authenticated access token is required")

    return build_study_chat_graph(
        dependencies=create_workflow_context(access_token),
    )
