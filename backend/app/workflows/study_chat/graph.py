from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver

from app.workflows.study_chat.dependencies import StudyChatWorkflowContext
from app.workflows.study_chat.nodes import generate_reply, inspect_message
from app.workflows.study_chat.state import StudyChatState


def build_study_chat_graph(
    checkpointer: AsyncPostgresSaver | None = None,
) -> CompiledStateGraph:
    builder = StateGraph[StudyChatState, StudyChatWorkflowContext](
        StudyChatState
    )

    builder.add_node("generate_reply", generate_reply)
    builder.add_node("inspect_message", inspect_message)

    builder.add_edge(START, "generate_reply")
    builder.add_edge("generate_reply", "inspect_message")
    builder.add_edge("inspect_message", END)

    return builder.compile(name="study_chat", checkpointer=checkpointer)
