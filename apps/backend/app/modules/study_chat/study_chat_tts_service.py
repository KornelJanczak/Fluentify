import logging
import time
from dataclasses import dataclass

import jwt
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
            token_response = await client.access_token.create(
                grants={"tts": True},
            )
            token = token_response.token
            try:
                payload = jwt.decode(token, options={"verify_signature": False})
                expires_at = int(payload.get("exp", time.time() + 3600))
            except Exception:
                expires_at = int(time.time() + 3600)

            return CartesiaAccessToken(
                access_token=token,
                expires_at=expires_at,
            )
        finally:
            await client.close()
