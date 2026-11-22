import logging
from openai import AsyncOpenAI, OpenAIError

logger = logging.getLogger(__name__)


class StudyChatTranscriptionService:
    def __init__(self, openai_client: AsyncOpenAI):
        self.openai_client = openai_client

    async def transcribe(
        self,
        audio_bytes: bytes,
        filename: str = "recording.webm",
        language_level: str = "B2",
    ) -> str:
        if not audio_bytes:
            raise ValueError("Audio file is empty")

        level = language_level.strip().upper() if language_level else "B2"
        prompt = (
            f"English learning conversation, CEFR level {level}. "
            "Student practicing spoken English."
        )

        logger.info(
            "Transcribing audio file: filename=%s size=%d bytes level=%s",
            filename,
            len(audio_bytes),
            level,
        )

        try:
            response = await self.openai_client.audio.transcriptions.create(
                model="whisper-1",
                file=(filename, audio_bytes),
                language="en",
                prompt=prompt,
                temperature=0.0,
            )
            return response.text
        except OpenAIError as exc:
            logger.error("OpenAI Whisper transcription failed: %s", exc)
            raise RuntimeError(f"Transcription failed: {exc}") from exc
