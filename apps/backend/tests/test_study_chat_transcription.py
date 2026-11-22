import io
from unittest.mock import AsyncMock, MagicMock
from fastapi import HTTPException, UploadFile
import pytest
from app.modules.study_chat.study_chat_router import study_chat_transcribe
from app.modules.study_chat.study_chat_transcription_service import (
    StudyChatTranscriptionService,
)
from app.modules.users.user_model import User


@pytest.fixture
def test_user() -> User:
    return User(
        id="user-123",
        email="test@example.com",
        password_hash="hash",
    )


@pytest.mark.asyncio
async def test_transcription_service_success():
    openai_client = MagicMock()
    transcription_result = MagicMock()
    transcription_result.text = "Hello world, this is a test."
    openai_client.audio.transcriptions.create = AsyncMock(
        return_value=transcription_result
    )

    service = StudyChatTranscriptionService(openai_client)
    text = await service.transcribe(
        audio_bytes=b"fake-audio-content",
        filename="speech.webm",
        language_level="B1",
    )

    assert text == "Hello world, this is a test."
    openai_client.audio.transcriptions.create.assert_awaited_once_with(
        model="whisper-1",
        file=("speech.webm", b"fake-audio-content"),
        language="en",
        prompt="English learning conversation, CEFR level B1. Student practicing spoken English.",
        temperature=0.0,
    )


@pytest.mark.asyncio
async def test_transcription_service_empty_bytes_raises():
    openai_client = MagicMock()
    service = StudyChatTranscriptionService(openai_client)

    with pytest.raises(ValueError, match="Audio file is empty"):
        await service.transcribe(audio_bytes=b"")


@pytest.mark.asyncio
async def test_router_transcribe_success(test_user: User):
    service = MagicMock()
    service.transcribe = AsyncMock(return_value="Recognized speech text.")

    upload_file = UploadFile(
        file=io.BytesIO(b"audio-data"),
        filename="test.webm",
    )

    response = await study_chat_transcribe(
        file=upload_file,
        language_level="C1",
        current_user=test_user,
        transcription_service=service,
    )

    assert response.text == "Recognized speech text."
    service.transcribe.assert_awaited_once_with(
        audio_bytes=b"audio-data",
        filename="test.webm",
        language_level="C1",
    )


@pytest.mark.asyncio
async def test_router_transcribe_unsupported_format(test_user: User):
    service = MagicMock()
    upload_file = UploadFile(
        file=io.BytesIO(b"bad-data"),
        filename="script.exe",
    )

    with pytest.raises(HTTPException) as exc_info:
        await study_chat_transcribe(
            file=upload_file,
            language_level="B2",
            current_user=test_user,
            transcription_service=service,
        )

    assert exc_info.value.status_code == 400
    assert "Unsupported audio format" in exc_info.value.detail


@pytest.mark.asyncio
async def test_router_transcribe_empty_file(test_user: User):
    service = MagicMock()
    upload_file = UploadFile(
        file=io.BytesIO(b""),
        filename="empty.webm",
    )

    with pytest.raises(HTTPException) as exc_info:
        await study_chat_transcribe(
            file=upload_file,
            language_level="B2",
            current_user=test_user,
            transcription_service=service,
        )

    assert exc_info.value.status_code == 400
    assert "provided audio file is empty" in exc_info.value.detail
