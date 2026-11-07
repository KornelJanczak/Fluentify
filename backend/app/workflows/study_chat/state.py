from typing import Annotated, TypedDict

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

from app.modules.error_analysis.error_analysis_schema import InlineInspectorSchema


class StudyChatState(TypedDict, total=False):
    messages: Annotated[list[BaseMessage], add_messages]
    flashcard_set_id: str
    user_id: str
    thread_id: str
    language_level: str
    reply: str
    inline_inspector: InlineInspectorSchema
