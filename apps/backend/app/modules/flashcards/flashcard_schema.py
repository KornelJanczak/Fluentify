from pydantic import BaseModel, ConfigDict, Field


class CreateFlashcardSchema(BaseModel):
    definition: str
    definition_translation: str
    example_sentences: list[str] = Field(default_factory=list)
    language: str
    flashcard_set_id: str


class CreateFlashcardInSetSchema(BaseModel):
    definition: str
    definition_translation: str
    example_sentences: list[str] = Field(default_factory=list)
    language: str


class UpdateFlashcardSchema(BaseModel):
    definition: str | None = None
    definition_translation: str | None = None
    example_sentences: list[str] | None = None
    language: str | None = None


class FlashcardResponseSchema(BaseModel):
    id: str
    definition: str
    definition_translation: str
    example_sentences: list[str] = Field(
        validation_alias="ai_example_sentences"
    )
    language: str
    flashcard_set_id: str

    model_config = ConfigDict(from_attributes=True)
