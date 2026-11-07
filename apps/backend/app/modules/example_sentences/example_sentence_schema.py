from pydantic import BaseModel, Field


class GeneratedExamplesSchema(BaseModel):
    examples: list[str] = Field(min_length=3, max_length=3)
