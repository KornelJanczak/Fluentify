"""
TDD tests for real-time TTS token generation.

User journeys:
  As an authenticated user, I want a short-lived Cartesia TTS token from the
  backend, so that my browser can open a WebSocket directly to Cartesia without
  exposing the master API key.
"""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi import HTTPException

from app.modules.study_chat.study_chat_tts_service import (
    CartesiaAccessToken,
    StudyChatTTSService,
)
from app.modules.study_chat.study_chat_router import study_chat_tts_token
from app.modules.users.user_model import User


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture
def test_user() -> User:
    return User(
        id="user-abc",
        email="student@example.com",
        password_hash="hash",
    )


@pytest.fixture
def mock_tts_service() -> StudyChatTTSService:
    service = MagicMock(spec=StudyChatTTSService)
    service.create_access_token = AsyncMock(
        return_value=CartesiaAccessToken(
            access_token="ephemeral-token-xyz",
            expires_at=9999999999,
        )
    )
    return service


# ---------------------------------------------------------------------------
# Unit tests: StudyChatTTSService
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_tts_service_returns_access_token():
    """
    Service delegates to Cartesia SDK and returns a CartesiaAccessToken
    dataclass with the token string and expiry timestamp.
    """
    mock_token_response = MagicMock()
    mock_token_response.access_token = "tok_abc123"
    mock_token_response.expires_at = 1234567890

    mock_access_tokens = MagicMock()
    mock_access_tokens.create = AsyncMock(return_value=mock_token_response)

    mock_client = MagicMock()
    mock_client.access_tokens = mock_access_tokens
    mock_client.close = AsyncMock()

    with patch(
        "app.modules.study_chat.study_chat_tts_service.AsyncCartesia",
        return_value=mock_client,
    ):
        service = StudyChatTTSService(cartesia_api_key="sk_car_test")
        token = await service.create_access_token()

    assert isinstance(token, CartesiaAccessToken)
    assert token.access_token == "tok_abc123"
    assert token.expires_at == 1234567890


@pytest.mark.asyncio
async def test_tts_service_requests_tts_only_grant():
    """
    Service requests a token scoped only to TTS (grants={'tts': True}).
    """
    mock_token_response = MagicMock()
    mock_token_response.access_token = "tok_xyz"
    mock_token_response.expires_at = 1111111111

    mock_access_tokens = MagicMock()
    mock_access_tokens.create = AsyncMock(return_value=mock_token_response)

    mock_client = MagicMock()
    mock_client.access_tokens = mock_access_tokens
    mock_client.close = AsyncMock()

    with patch(
        "app.modules.study_chat.study_chat_tts_service.AsyncCartesia",
        return_value=mock_client,
    ):
        service = StudyChatTTSService(cartesia_api_key="sk_car_test")
        await service.create_access_token()

    mock_access_tokens.create.assert_awaited_once_with(
        grants={"tts": True},
    )


@pytest.mark.asyncio
async def test_tts_service_closes_client_after_token():
    """
    Service always closes the AsyncCartesia client, even on success, to avoid
    connection leaks.
    """
    mock_token_response = MagicMock()
    mock_token_response.access_token = "tok"
    mock_token_response.expires_at = 123

    mock_access_tokens = MagicMock()
    mock_access_tokens.create = AsyncMock(return_value=mock_token_response)

    mock_client = MagicMock()
    mock_client.access_tokens = mock_access_tokens
    mock_client.close = AsyncMock()

    with patch(
        "app.modules.study_chat.study_chat_tts_service.AsyncCartesia",
        return_value=mock_client,
    ):
        service = StudyChatTTSService(cartesia_api_key="sk_car_test")
        await service.create_access_token()

    mock_client.close.assert_awaited_once()


@pytest.mark.asyncio
async def test_tts_service_closes_client_on_error():
    """
    Service closes the AsyncCartesia client even when Cartesia raises an error.
    """
    mock_access_tokens = MagicMock()
    mock_access_tokens.create = AsyncMock(side_effect=RuntimeError("API down"))

    mock_client = MagicMock()
    mock_client.access_tokens = mock_access_tokens
    mock_client.close = AsyncMock()

    with patch(
        "app.modules.study_chat.study_chat_tts_service.AsyncCartesia",
        return_value=mock_client,
    ):
        service = StudyChatTTSService(cartesia_api_key="sk_car_test")
        with pytest.raises(RuntimeError, match="API down"):
            await service.create_access_token()

    mock_client.close.assert_awaited_once()


# ---------------------------------------------------------------------------
# Router integration tests: GET /study-chat/tts/token
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_router_tts_token_returns_token_for_authenticated_user(
    test_user: User,
    mock_tts_service: StudyChatTTSService,
):
    """
    Authenticated user receives access_token and expires_at in the response.
    """
    response = await study_chat_tts_token(
        current_user=test_user,
        tts_service=mock_tts_service,
    )

    assert response.access_token == "ephemeral-token-xyz"
    assert response.expires_at == 9999999999


@pytest.mark.asyncio
async def test_router_tts_token_calls_service_once(
    test_user: User,
    mock_tts_service: StudyChatTTSService,
):
    """
    Router delegates token creation to the TTS service exactly once.
    """
    await study_chat_tts_token(
        current_user=test_user,
        tts_service=mock_tts_service,
    )

    mock_tts_service.create_access_token.assert_awaited_once()


@pytest.mark.asyncio
async def test_router_tts_token_propagates_service_error(
    test_user: User,
):
    """
    When the TTS service raises an unexpected error the router lets it
    propagate so FastAPI's exception handler can return 502.
    """
    failing_service = MagicMock(spec=StudyChatTTSService)
    failing_service.create_access_token = AsyncMock(
        side_effect=RuntimeError("Cartesia unavailable")
    )

    with pytest.raises(RuntimeError, match="Cartesia unavailable"):
        await study_chat_tts_token(
            current_user=test_user,
            tts_service=failing_service,
        )
