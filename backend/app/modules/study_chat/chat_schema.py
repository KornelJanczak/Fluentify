from typing import Literal

from pydantic import BaseModel, Field
from typing import Literal

from app.modules.error_analysis.error_analysis_schema import InlineInspectorSchema


class StudyChatResponseSchema(BaseModel):
    response: str
    inline_inspector: InlineInspectorSchema


class StudyChatHistoryMessageSchema(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    inline_inspector: InlineInspectorSchema | None = None


class StudyChatMessageSchema(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    language_level: str = Field(default="B2", max_length=20)


class StudyChatHistoryMessageSchema(BaseModel):
    role: Literal["user", "assistant"]
    content: str
