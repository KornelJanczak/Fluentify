"""
TDD tests for TTS audio upload to Neon Object Storage.

User journeys:
  As an authenticated user, I want to upload WAV audio of a TTS response to
  object storage, so it can be referenced later (e.g. pronunciation review).
"""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi import HTTPException

from app.modules.study_chat.study_chat_audio_service import (
    AudioUploadResult,
    StudyChatAudioService,
)
from app.modules.study_chat.study_chat_router import study_chat_upload_tts_audio
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
def mock_audio_service() -> StudyChatAudioService:
    service = MagicMock(spec=StudyChatAudioService)
    service.upload_wav = AsyncMock(
        return_value=AudioUploadResult(
            key="tts-audio/user-abc/set-1/uuid.wav",
            url="https://storage.example.com/tts-audio/user-abc/set-1/uuid.wav?presigned=1",
        )
    )
    return service


@pytest.fixture
def tiny_wav() -> bytes:
    """Minimal valid WAV header (44 bytes) with zero data samples."""
    import struct

    data_bytes = 0
    header = struct.pack(
        "<4sI4s4sIHHIIHH4sI",
        b"RIFF",
        36 + data_bytes,
        b"WAVE",
        b"fmt ",
        16,
        3,       # IEEE float
        1,       # mono
        44100,   # sample rate
        44100 * 4,  # byte rate
        4,       # block align
        32,      # bits per sample
        b"data",
        data_bytes,
    )
    return header


# ---------------------------------------------------------------------------
# Unit tests: StudyChatAudioService
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_audio_service_uploads_to_correct_bucket():
    """Service calls put_object with the configured bucket name."""
    mock_s3 = AsyncMock()
    mock_s3.put_object = AsyncMock()
    mock_s3.generate_presigned_url = AsyncMock(return_value="https://example.com/signed")
    mock_s3.__aenter__ = AsyncMock(return_value=mock_s3)
    mock_s3.__aexit__ = AsyncMock(return_value=False)

    mock_session = MagicMock()
    mock_session.client.return_value = mock_s3

    with patch(
        "app.modules.study_chat.study_chat_audio_service.aioboto3.Session",
        return_value=mock_session,
    ):
        service = StudyChatAudioService(
            endpoint_url="https://storage.example.com",
            aws_access_key_id="key",
            aws_secret_access_key="secret",
            region_name="us-east-2",
            bucket_name="tts-audio",
        )
        result = await service.upload_wav(
            audio_bytes=b"\x00" * 100,
            user_id="user-1",
            flashcard_set_id="set-1",
        )

    mock_s3.put_object.assert_awaited_once()
    call_kwargs = mock_s3.put_object.call_args.kwargs
    assert call_kwargs["Bucket"] == "tts-audio"
    assert call_kwargs["ContentType"] == "audio/wav"
    assert isinstance(result.key, str)
    assert result.key.startswith("tts-audio/user-1/set-1/")
    assert result.key.endswith(".wav")


@pytest.mark.asyncio
async def test_audio_service_key_contains_user_and_set():
    """Object key embeds user_id and flashcard_set_id."""
    mock_s3 = AsyncMock()
    mock_s3.put_object = AsyncMock()
    mock_s3.generate_presigned_url = AsyncMock(return_value="https://example.com/signed")
    mock_s3.__aenter__ = AsyncMock(return_value=mock_s3)
    mock_s3.__aexit__ = AsyncMock(return_value=False)

    mock_session = MagicMock()
    mock_session.client.return_value = mock_s3

    with patch(
        "app.modules.study_chat.study_chat_audio_service.aioboto3.Session",
        return_value=mock_session,
    ):
        service = StudyChatAudioService(
            endpoint_url="https://storage.example.com",
            aws_access_key_id="key",
            aws_secret_access_key="secret",
            region_name="us-east-2",
            bucket_name="tts-audio",
        )
        result = await service.upload_wav(
            audio_bytes=b"\x00" * 10,
            user_id="u-xyz",
            flashcard_set_id="fs-abc",
        )

    assert "/u-xyz/" in result.key
    assert "/fs-abc/" in result.key


@pytest.mark.asyncio
async def test_audio_service_returns_presigned_url():
    """Service returns the pre-signed URL produced by generate_presigned_url."""
    expected_url = "https://storage.example.com/signed?token=abc"

    mock_s3 = AsyncMock()
    mock_s3.put_object = AsyncMock()
    mock_s3.generate_presigned_url = AsyncMock(return_value=expected_url)
    mock_s3.__aenter__ = AsyncMock(return_value=mock_s3)
    mock_s3.__aexit__ = AsyncMock(return_value=False)

    mock_session = MagicMock()
    mock_session.client.return_value = mock_s3

    with patch(
        "app.modules.study_chat.study_chat_audio_service.aioboto3.Session",
        return_value=mock_session,
    ):
        service = StudyChatAudioService(
            endpoint_url="https://storage.example.com",
            aws_access_key_id="key",
            aws_secret_access_key="secret",
            region_name="us-east-2",
            bucket_name="tts-audio",
        )
        result = await service.upload_wav(
            audio_bytes=b"\x00" * 10,
            user_id="u",
            flashcard_set_id="fs",
        )

    assert result.url == expected_url


# ---------------------------------------------------------------------------
# Router integration tests: POST /study-chat/tts/audio
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_router_upload_returns_201_with_key_and_url(
    test_user: User,
    mock_audio_service: StudyChatAudioService,
    tiny_wav: bytes,
):
    """Authenticated upload of a valid WAV returns 201 with key and url."""
    mock_file = MagicMock()
    mock_file.read = AsyncMock(return_value=tiny_wav)

    response = await study_chat_upload_tts_audio(
        flashcard_set_id="set-1",
        file=mock_file,
        current_user=test_user,
        audio_service=mock_audio_service,
    )

    assert response.key == "tts-audio/user-abc/set-1/uuid.wav"
    assert "presigned" in response.url


@pytest.mark.asyncio
async def test_router_upload_calls_service_with_user_and_set(
    test_user: User,
    mock_audio_service: StudyChatAudioService,
    tiny_wav: bytes,
):
    """Router passes user_id and flashcard_set_id to the audio service."""
    mock_file = MagicMock()
    mock_file.read = AsyncMock(return_value=tiny_wav)

    await study_chat_upload_tts_audio(
        flashcard_set_id="set-42",
        file=mock_file,
        current_user=test_user,
        audio_service=mock_audio_service,
    )

    mock_audio_service.upload_wav.assert_awaited_once_with(
        audio_bytes=tiny_wav,
        user_id=str(test_user.id),
        flashcard_set_id="set-42",
    )


@pytest.mark.asyncio
async def test_router_upload_rejects_empty_file(
    test_user: User,
    mock_audio_service: StudyChatAudioService,
):
    """Empty upload body returns 400."""
    mock_file = MagicMock()
    mock_file.read = AsyncMock(return_value=b"")

    with pytest.raises(HTTPException) as exc_info:
        await study_chat_upload_tts_audio(
            flashcard_set_id="set-1",
            file=mock_file,
            current_user=test_user,
            audio_service=mock_audio_service,
        )

    assert exc_info.value.status_code == 400


@pytest.mark.asyncio
async def test_router_upload_rejects_oversized_file(
    test_user: User,
    mock_audio_service: StudyChatAudioService,
):
    """Files larger than 10 MB return 413."""
    mock_file = MagicMock()
    mock_file.read = AsyncMock(return_value=b"\x00" * (10 * 1024 * 1024 + 1))

    with pytest.raises(HTTPException) as exc_info:
        await study_chat_upload_tts_audio(
            flashcard_set_id="set-1",
            file=mock_file,
            current_user=test_user,
            audio_service=mock_audio_service,
        )

    assert exc_info.value.status_code == 413


@pytest.mark.asyncio
async def test_router_upload_maps_service_error_to_502(
    test_user: User,
    tiny_wav: bytes,
):
    """When the audio service raises an unexpected error, the router returns 502."""
    failing_service = MagicMock(spec=StudyChatAudioService)
    failing_service.upload_wav = AsyncMock(side_effect=RuntimeError("S3 unreachable"))

    mock_file = MagicMock()
    mock_file.read = AsyncMock(return_value=tiny_wav)

    with pytest.raises(HTTPException) as exc_info:
        await study_chat_upload_tts_audio(
            flashcard_set_id="set-1",
            file=mock_file,
            current_user=test_user,
            audio_service=failing_service,
        )

    assert exc_info.value.status_code == 502

