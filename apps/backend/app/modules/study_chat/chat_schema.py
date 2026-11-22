from typing import Literal

from pydantic import BaseModel

from app.modules.error_analysis.error_analysis_schema import InlineInspectorSchema


class StudyChatHistoryMessageSchema(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    inline_inspector: InlineInspectorSchema | None = None


class StudyChatTranscriptionResponseSchema(BaseModel):
    text: str


class AudioUploadResponseSchema(BaseModel):
    key: str
    url: str
