from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, utc_now

if TYPE_CHECKING:
    from app.modules.flashcards.flashcard_model import FlashCard
    from app.modules.users.user_model import User


class FlashcardSet(Base):
    __tablename__ = "flashcard_sets"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user: Mapped["User"] = relationship(back_populates="flashcard_sets")
    flashcards: Mapped[list["FlashCard"]] = relationship(
        back_populates="flashcard_set",
        cascade="all, delete-orphan",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now
    )
