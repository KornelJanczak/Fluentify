from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterUserSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class FlashcardSetSummarySchema(BaseModel):
    id: str
    name: str

    model_config = ConfigDict(from_attributes=True)


class UserResponseSchema(BaseModel):
    id: str
    email: EmailStr
    created_at: datetime
    flashcard_sets: list[FlashcardSetSummarySchema] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class TokenResponseSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
