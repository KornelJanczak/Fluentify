"""
TDD tests for TTS audio upload to Neon Object Storage.

User journeys:
  As an authenticated user, I want to upload WAV audio of a TTS response to
  object storage, so it can be referenced later (e.g. pronunciation review).
"""

from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import HTTPException

from app.infrastructure.storage.s3_storage_client import S3StorageClient
from app.modules.flashcard_sets.flashcard_set_model import FlashcardSet
from app.modules.flashcard_sets.flashcard_set_service import FlashcardSetService
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
def mock_flashcard_set_service() -> FlashcardSetService:
    service = MagicMock(spec=FlashcardSetService)
    service.get_flashcard_set_by_id = AsyncMock(
        return_value=FlashcardSet(
            id="set-1",
            user_id="user-abc",
            name="Vocabulary",
        )
    )
    return service


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
        3,  # IEEE float
        1,  # mono
        44100,  # sample rate
        44100 * 4,  # byte rate
        4,  # block align
        32,  # bits per sample
        b"data",
        data_bytes,
    )
    return header


# ---------------------------------------------------------------------------
# Unit tests: StudyChatAudioService
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_audio_service_uploads_to_correct_bucket():
    """Service calls storage_client.put_object with the configured bucket name."""
    mock_storage_client = MagicMock(spec=S3StorageClient)
    mock_storage_client.put_object = AsyncMock()
    mock_storage_client.generate_presigned_url = AsyncMock(
        return_value="https://example.com/signed"
    )

    service = StudyChatAudioService(
        storage_client=mock_storage_client,
        bucket_name="tts-audio",
    )
    result = await service.upload_wav(
        audio_bytes=b"\x00" * 100,
        user_id="user-1",
        flashcard_set_id="set-1",
    )

    mock_storage_client.put_object.assert_awaited_once_with(
        bucket="tts-audio",
        key=result.key,
        body=b"\x00" * 100,
        content_type="audio/wav",
    )
    assert isinstance(result.key, str)
    assert result.key.startswith("tts-audio/user-1/set-1/")
    assert result.key.endswith(".wav")


@pytest.mark.asyncio
async def test_audio_service_key_contains_user_and_set():
    """Object key embeds user_id and flashcard_set_id."""
    mock_storage_client = MagicMock(spec=S3StorageClient)
    mock_storage_client.put_object = AsyncMock()
    mock_storage_client.generate_presigned_url = AsyncMock(
        return_value="https://example.com/signed"
    )

    service = StudyChatAudioService(
        storage_client=mock_storage_client,
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

    mock_storage_client = MagicMock(spec=S3StorageClient)
    mock_storage_client.put_object = AsyncMock()
    mock_storage_client.generate_presigned_url = AsyncMock(
        return_value=expected_url
    )

    service = StudyChatAudioService(
        storage_client=mock_storage_client,
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
    mock_flashcard_set_service: FlashcardSetService,
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
        flashcard_set_service=mock_flashcard_set_service,
        audio_service=mock_audio_service,
    )

    assert response.key == "tts-audio/user-abc/set-1/uuid.wav"
    assert "presigned" in response.url


@pytest.mark.asyncio
async def test_router_upload_calls_service_with_user_and_set(
    test_user: User,
    mock_flashcard_set_service: FlashcardSetService,
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
        flashcard_set_service=mock_flashcard_set_service,
        audio_service=mock_audio_service,
    )

    mock_audio_service.upload_wav.assert_awaited_once_with(
        audio_bytes=tiny_wav,
        user_id=str(test_user.id),
        flashcard_set_id="set-42",
    )


@pytest.mark.asyncio
async def test_router_upload_rejects_unowned_set(
    test_user: User,
    mock_audio_service: StudyChatAudioService,
    tiny_wav: bytes,
):
    """Upload to non-existent or unowned flashcard set returns 404."""
    unowned_service = MagicMock(spec=FlashcardSetService)
    unowned_service.get_flashcard_set_by_id = AsyncMock(return_value=None)

    mock_file = MagicMock()
    mock_file.read = AsyncMock(return_value=tiny_wav)

    with pytest.raises(HTTPException) as exc_info:
        await study_chat_upload_tts_audio(
            flashcard_set_id="foreign-set",
            file=mock_file,
            current_user=test_user,
            flashcard_set_service=unowned_service,
            audio_service=mock_audio_service,
        )

    assert exc_info.value.status_code == 404


@pytest.mark.asyncio
async def test_router_upload_rejects_invalid_wav_signature(
    test_user: User,
    mock_flashcard_set_service: FlashcardSetService,
    mock_audio_service: StudyChatAudioService,
):
    """Audio that is not a valid WAV file returns 400."""
    mock_file = MagicMock()
    mock_file.read = AsyncMock(return_value=b"NOT_A_WAV_FILE_HEADER")

    with pytest.raises(HTTPException) as exc_info:
        await study_chat_upload_tts_audio(
            flashcard_set_id="set-1",
            file=mock_file,
            current_user=test_user,
            flashcard_set_service=mock_flashcard_set_service,
            audio_service=mock_audio_service,
        )

    assert exc_info.value.status_code == 400
    assert "WAV" in exc_info.value.detail


@pytest.mark.asyncio
async def test_router_upload_rejects_empty_file(
    test_user: User,
    mock_flashcard_set_service: FlashcardSetService,
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
            flashcard_set_service=mock_flashcard_set_service,
            audio_service=mock_audio_service,
        )

    assert exc_info.value.status_code == 400


@pytest.mark.asyncio
async def test_router_upload_rejects_oversized_file(
    test_user: User,
    mock_flashcard_set_service: FlashcardSetService,
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
            flashcard_set_service=mock_flashcard_set_service,
            audio_service=mock_audio_service,
        )

    assert exc_info.value.status_code == 413


@pytest.mark.asyncio
async def test_router_upload_maps_service_error_to_502(
    test_user: User,
    mock_flashcard_set_service: FlashcardSetService,
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
            flashcard_set_service=mock_flashcard_set_service,
            audio_service=failing_service,
        )

    assert exc_info.value.status_code == 502
