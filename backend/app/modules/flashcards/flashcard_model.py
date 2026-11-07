from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import JSON, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, utc_now

if TYPE_CHECKING:
    from app.modules.flashcard_sets.flashcard_set_model import FlashcardSet


class FlashCard(Base):
    __tablename__ = "flashcards"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    definition: Mapped[str] = mapped_column(String, nullable=False)
    definition_translation: Mapped[str] = mapped_column(String, nullable=False)
    ai_example_sentences: Mapped[list[str]] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )
    language: Mapped[str] = mapped_column(String, nullable=False)
    flashcard_set_id: Mapped[str] = mapped_column(
        ForeignKey("flashcard_sets.id", ondelete="CASCADE"),
        nullable=False,
    )
    flashcard_set: Mapped["FlashcardSet"] = relationship(
        back_populates="flashcards"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now
    )
