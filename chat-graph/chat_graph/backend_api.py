from dataclasses import dataclass
from enum import StrEnum

import httpx
from pydantic import BaseModel, ConfigDict, Field


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


class FlashcardResponse(BaseModel):
    id: str
    definition: str
    definition_translation: str
    example_sentences: list[str]
    language: str
    flashcard_set_id: str

    model_config = ConfigDict(from_attributes=True)


class FlashcardSetResponse(BaseModel):
    id: str
    name: str
    flashcard_count: int = 0
    flashcards: list[FlashcardResponse]


class StudyChatContextResponse(BaseModel):
    flashcard_set: FlashcardSetResponse
    analysis_summary: str


class StudyChatInspectionRequest(BaseModel):
    inspection: InlineInspectorSchema
    language_level: str = "B2"
    thread_id: str | None = None
    inspection_request_id: str = Field(min_length=1, max_length=255)
    model_name: str = Field(min_length=1, max_length=255)
    prompt_version: str = Field(min_length=1, max_length=255)


@dataclass
class BackendApiError(Exception):
    status_code: int
    detail: str

    def __str__(self) -> str:
        return f"Backend API request failed ({self.status_code}): {self.detail}"


class BackendApiClient:
    def __init__(
        self,
        base_url: str,
        *,
        timeout: float = 10.0,
        http_client: httpx.AsyncClient | None = None,
    ) -> None:
        self._base_url = base_url.rstrip("/")
        self._timeout = timeout
        self._http_client = http_client

    async def get_study_chat_context(
        self,
        flashcard_set_id: str,
        access_token: str,
    ) -> StudyChatContextResponse:
        headers = {"Authorization": f"Bearer {access_token}"}
        request_url = (
            f"{self._base_url}/internal/v1/study-chat/"
            f"{flashcard_set_id}/context"
        )

        if self._http_client is not None:
            response = await self._http_client.get(
                request_url,
                headers=headers,
                timeout=self._timeout,
            )
            return self._parse_response(response)

        async with httpx.AsyncClient(timeout=self._timeout) as client:
            response = await client.get(request_url, headers=headers)
            return self._parse_response(response)

    async def persist_study_chat_inspection(
        self,
        flashcard_set_id: str,
        request: StudyChatInspectionRequest,
        access_token: str,
    ) -> InlineInspectorSchema:
        headers = {"Authorization": f"Bearer {access_token}"}
        request_url = (
            f"{self._base_url}/internal/v1/study-chat/"
            f"{flashcard_set_id}/inspection"
        )
        payload = request.model_dump(mode="json")

        if self._http_client is not None:
            response = await self._http_client.post(
                request_url,
                headers=headers,
                json=payload,
                timeout=self._timeout,
            )
            return self._parse_inspection_response(response)

        async with httpx.AsyncClient(timeout=self._timeout) as client:
            response = await client.post(
                request_url,
                headers=headers,
                json=payload,
            )
            return self._parse_inspection_response(response)

    @staticmethod
    def _parse_response(
        response: httpx.Response,
    ) -> StudyChatContextResponse:
        if response.is_error:
            try:
                detail = response.json().get("detail", response.text)
            except ValueError:
                detail = response.text
            raise BackendApiError(response.status_code, str(detail))

        return StudyChatContextResponse.model_validate(response.json())

    @staticmethod
    def _parse_inspection_response(
        response: httpx.Response,
    ) -> InlineInspectorSchema:
        if response.is_error:
            try:
                detail = response.json().get("detail", response.text)
            except ValueError:
                detail = response.text
            raise BackendApiError(response.status_code, str(detail))

        return InlineInspectorSchema.model_validate(response.json())
