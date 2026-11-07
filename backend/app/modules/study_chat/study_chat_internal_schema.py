from pydantic import BaseModel, Field

from app.modules.error_analysis.error_analysis_schema import (
    InlineInspectorSchema,
)
from app.modules.flashcard_sets.flashcard_set_schema import (
    FlashcardSetWithFlashcardsResponseSchema,
)


class StudyChatContextResponseSchema(BaseModel):
    flashcard_set: FlashcardSetWithFlashcardsResponseSchema
    analysis_summary: str


class StudyChatInspectionRequestSchema(BaseModel):
    inspection: InlineInspectorSchema
    language_level: str = "B2"
    thread_id: str | None = None
    inspection_request_id: str = Field(min_length=1, max_length=255)
    model_name: str = Field(min_length=1, max_length=255)
    prompt_version: str = Field(min_length=1, max_length=255)
