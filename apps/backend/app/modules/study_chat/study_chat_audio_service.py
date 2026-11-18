import logging
import uuid
from dataclasses import dataclass

import aioboto3

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class AudioUploadResult:
    key: str
    url: str  # pre-signed GET URL valid for 1 hour


class StudyChatAudioService:
    """Uploads TTS audio blobs to Neon Object Storage (S3-compatible)."""

    def __init__(
        self,
        endpoint_url: str,
        aws_access_key_id: str,
        aws_secret_access_key: str,
        region_name: str,
        bucket_name: str,
    ) -> None:
        self._session = aioboto3.Session(
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name,
        )
        self._endpoint_url = endpoint_url
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
        async with self._session.client(
            "s3",
            endpoint_url=self._endpoint_url,
        ) as s3:
            await s3.put_object(
                Bucket=self._bucket,
                Key=key,
                Body=audio_bytes,
                ContentType="audio/wav",
            )
            url: str = await s3.generate_presigned_url(
                "get_object",
                Params={"Bucket": self._bucket, "Key": key},
                ExpiresIn=3600,
            )

        return AudioUploadResult(key=key, url=url)
