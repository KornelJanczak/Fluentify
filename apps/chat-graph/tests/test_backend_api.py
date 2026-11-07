import httpx
import pytest

from chat_graph.backend_api import BackendApiClient, BackendApiError


@pytest.mark.asyncio
async def test_get_study_chat_context_sends_bearer_token() -> None:
    request_headers: dict[str, str] = {}

    def handler(request: httpx.Request) -> httpx.Response:
        request_headers.update(request.headers)
        return httpx.Response(
            200,
            json={
                "flashcard_set": {
                    "id": "set-123",
                    "name": "Travel",
                    "flashcard_count": 1,
                    "flashcards": [
                        {
                            "id": "card-123",
                            "definition": "boarding pass",
                            "definition_translation": "karta pokladowa",
                            "example_sentences": ["I lost my boarding pass."],
                            "language": "en",
                            "flashcard_set_id": "set-123",
                        },
                    ],
                },
                "analysis_summary": "No previous language analysis is available.",
            },
        )

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        api = BackendApiClient("http://backend", http_client=client)
        result = await api.get_study_chat_context("set-123", "token-123")

    assert request_headers["authorization"] == "Bearer token-123"
    assert result.flashcard_set.id == "set-123"
    assert result.flashcard_set.flashcards[0].definition == "boarding pass"


@pytest.mark.asyncio
async def test_get_study_chat_context_raises_for_backend_error() -> None:
    def handler(_request: httpx.Request) -> httpx.Response:
        return httpx.Response(404, json={"detail": "Flashcard set not found"})

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        api = BackendApiClient("http://backend", http_client=client)

        with pytest.raises(BackendApiError, match="Flashcard set not found"):
            await api.get_study_chat_context("missing", "token-123")
