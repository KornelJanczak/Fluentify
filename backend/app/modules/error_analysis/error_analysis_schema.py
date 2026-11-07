from enum import StrEnum

from pydantic import BaseModel, Field


class LanguageErrorType(StrEnum):
    GRAMMAR = "grammar"
    VOCABULARY = "vocabulary"
    SPELLING = "spelling"
    WORD_ORDER = "word_order"
    COLLOCATION = "collocation"
    NATURALNESS = "naturalness"
    PUNCTUATION = "punctuation"


class LanguageError(BaseModel):
    original_fragment: str
    corrected_fragment: str
    error_type: LanguageErrorType
    explanation: str
    start_index: int | None = None
    end_index: int | None = None


class InlineInspectorSchema(BaseModel):
    original_message: str
    corrected_message: str | None = None
    errors: list[LanguageError] = Field(default_factory=list)
