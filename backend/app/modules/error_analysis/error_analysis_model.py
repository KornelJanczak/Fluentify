from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, utc_now


class StudyChatErrorAnalysis(Base):
    __tablename__ = "study_chat_error_analysis"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    flashcard_set_id: Mapped[str] = mapped_column(
        ForeignKey("flashcard_sets.id", ondelete="CASCADE"),
        nullable=False,
    )
    thread_id: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
        index=True,
    )
    inspection_request_id: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
        unique=True,
    )
    original_message: Mapped[str] = mapped_column(String, nullable=False)
    corrected_message: Mapped[str | None] = mapped_column(
        String, nullable=True)
    language_errors: Mapped[list[dict[str, object]]] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )
    language_level: Mapped[str] = mapped_column(String, nullable=False)
    model_name: Mapped[str] = mapped_column(String, nullable=False)
    prompt_version: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
    )
