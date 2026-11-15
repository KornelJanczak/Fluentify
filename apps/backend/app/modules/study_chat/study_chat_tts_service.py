import logging
from dataclasses import dataclass

from cartesia import AsyncCartesia

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class CartesiaAccessToken:
    access_token: str
    expires_at: int  # Unix timestamp


class StudyChatTTSService:
    """Generates short-lived Cartesia access tokens for browser-side TTS."""

    def __init__(self, cartesia_api_key: str) -> None:
        self._api_key = cartesia_api_key

    async def create_access_token(self) -> CartesiaAccessToken:
        """Return a TTS-scoped ephemeral Cartesia access token."""
        client = AsyncCartesia(api_key=self._api_key)
        try:
            token_response = await client.access_tokens.create(
                grants={"tts": True},
            )
            return CartesiaAccessToken(
                access_token=token_response.access_token,
                expires_at=token_response.expires_at,
            )
        finally:
            await client.close()
