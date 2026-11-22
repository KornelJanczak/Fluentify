import logging

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from langgraph_sdk.client import LangGraphClient
from pydantic import BaseModel

from app.modules.study_chat.chat_schema import (
    AudioUploadResponseSchema,
    StudyChatHistoryMessageSchema,
    StudyChatTranscriptionResponseSchema,
)
from app.modules.study_chat.study_chat_audio_service import StudyChatAudioService
from app.modules.study_chat.study_chat_dependencies import (
    get_langgraph_client,
    get_study_chat_audio_service,
    get_study_chat_history_service,
    get_study_chat_transcription_service,
    get_study_chat_tts_service,
)
from app.modules.study_chat.study_chat_history_service import (
    StudyChatHistoryService,
)
from app.modules.study_chat.study_chat_transcription_service import (
    StudyChatTranscriptionService,
)
from app.modules.study_chat.study_chat_tts_service import StudyChatTTSService
from app.modules.study_chat.study_chat_thread import (
    get_study_chat_thread_id,
)
from app.modules.users.user_model import User
from app.modules.users.users_dependencies import get_current_user

router = APIRouter(prefix="/study-chat", tags=["study-chat"])
logger = logging.getLogger(__name__)

MAX_AUDIO_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB limit for Whisper
SUPPORTED_EXTENSIONS = {".webm", ".mp4", ".mp3", ".wav", ".ogg", ".m4a"}

MAX_TTS_AUDIO_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit for TTS recordings


class CartesiaTokenResponseSchema(BaseModel):
    access_token: str
    expires_at: int


@router.get(
    "/tts/token",
    response_model=CartesiaTokenResponseSchema,
)
async def study_chat_tts_token(
    current_user: User = Depends(get_current_user),
    tts_service: StudyChatTTSService = Depends(get_study_chat_tts_service),
) -> CartesiaTokenResponseSchema:
    """Generate a short-lived Cartesia TTS access token for browser-side WebSocket use."""
    token_data = await tts_service.create_access_token()
    return CartesiaTokenResponseSchema(
        access_token=token_data.access_token,
        expires_at=token_data.expires_at,
    )


@router.post(
    "/transcribe",
    response_model=StudyChatTranscriptionResponseSchema,
)
async def study_chat_transcribe(
    file: UploadFile = File(...),
    language_level: str = Form("B2"),
    current_user: User = Depends(get_current_user),
    transcription_service: StudyChatTranscriptionService = Depends(
        get_study_chat_transcription_service
    ),
) -> StudyChatTranscriptionResponseSchema:
    filename = file.filename or "recording.webm"
    extension = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if extension not in SUPPORTED_EXTENSIONS:
        logger.warning(
            "Unsupported audio file uploaded: filename=%s content_type=%s user_id=%s",
            filename,
            file.content_type,
            current_user.id,
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported audio format. Supported extensions: {', '.join(sorted(SUPPORTED_EXTENSIONS))}",
        )

    audio_bytes = await file.read()
    if not audio_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The provided audio file is empty.",
        )

    if len(audio_bytes) > MAX_AUDIO_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="The audio file exceeds the maximum allowed size of 25 MB.",
        )

    try:
        text = await transcription_service.transcribe(
            audio_bytes=audio_bytes,
            filename=filename,
            language_level=language_level,
        )
        return StudyChatTranscriptionResponseSchema(text=text)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        logger.error(
            "Transcription endpoint failed for user_id=%s: %s",
            current_user.id,
            exc,
        )
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Speech-to-text service is temporarily unavailable.",
        ) from exc


@router.get(
    "/{flashcard_set_id}/history",
    response_model=list[StudyChatHistoryMessageSchema],
)
async def study_chat_history(
    flashcard_set_id: str,
    current_user: User = Depends(get_current_user),
    langgraph_client: LangGraphClient = Depends(get_langgraph_client),
    history_service: StudyChatHistoryService = Depends(
        get_study_chat_history_service
    ),
) -> list[StudyChatHistoryMessageSchema]:
    logger.info(
        "Retrieving chat history: user_id=%s flashcard_set_id=%s",
        current_user.id,
        flashcard_set_id,
    )

    thread_id = get_study_chat_thread_id(flashcard_set_id)
    messages: list[object] = []

    try:
        state = await langgraph_client.threads.get_state(thread_id)
        if state and isinstance(state.get("values"), dict):
            messages = state["values"].get("messages", [])
    except Exception as exc:
        logger.warning(
            "Could not fetch LangGraph state for thread_id=%s: %s",
            thread_id,
            exc,
        )

    return await history_service.get_history(
        flashcard_set_id=flashcard_set_id,
        user_id=current_user.id,
        thread_id=thread_id,
        messages=messages,
    )


@router.post(
    "/tts/audio",
    response_model=AudioUploadResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
async def study_chat_upload_tts_audio(
    flashcard_set_id: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    audio_service: StudyChatAudioService = Depends(get_study_chat_audio_service),
) -> AudioUploadResponseSchema:
    """Upload TTS audio (WAV) to Neon Object Storage after a successful stream."""
    audio_bytes = await file.read()

    if not audio_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Audio file is empty.",
        )
    if len(audio_bytes) > MAX_TTS_AUDIO_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Audio file too large (max 10 MB).",
        )

    try:
        result = await audio_service.upload_wav(
            audio_bytes=audio_bytes,
            user_id=str(current_user.id),
            flashcard_set_id=flashcard_set_id,
        )
    except Exception as exc:
        logger.error(
            "TTS audio upload failed: user_id=%s flashcard_set_id=%s error=%s",
            current_user.id,
            flashcard_set_id,
            exc,
        )
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Object storage is temporarily unavailable.",
        ) from exc

    logger.info(
        "TTS audio uploaded: user_id=%s flashcard_set_id=%s key=%s",
        current_user.id,
        flashcard_set_id,
        result.key,
    )
    return AudioUploadResponseSchema(key=result.key, url=result.url)
