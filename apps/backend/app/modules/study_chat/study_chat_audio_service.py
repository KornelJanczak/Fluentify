import logging
import uuid
from dataclasses import dataclass

from app.infrastructure.storage.s3_storage_client import S3StorageClient

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class AudioUploadResult:
    key: str
    url: str  # pre-signed GET URL valid for 1 hour


class StudyChatAudioService:
    """Uploads TTS audio blobs to Neon Object Storage (S3-compatible)."""

    def __init__(
        self,
        storage_client: S3StorageClient,
        bucket_name: str,
    ) -> None:
        self._storage_client = storage_client
        self._bucket = bucket_name

    async def upload_wav(
        self,
        audio_bytes: bytes,
        user_id: str,
        flashcard_set_id: str,
    ) -> AudioUploadResult:
        """Store *audio_bytes* as a WAV object and return its key + pre-signed URL."""
        key = f"tts-audio/{user_id}/{flashcard_set_id}/{uuid.uuid4()}.wav"
        logger.debug(
            "Uploading TTS audio: bucket=%s key=%s size=%d",
            self._bucket,
            key,
            len(audio_bytes),
        )
        await self._storage_client.put_object(
            bucket=self._bucket,
            key=key,
            body=audio_bytes,
            content_type="audio/wav",
        )
        url = await self._storage_client.generate_presigned_url(
            bucket=self._bucket,
            key=key,
            expires_in=3600,
        )
        return AudioUploadResult(key=key, url=url)
