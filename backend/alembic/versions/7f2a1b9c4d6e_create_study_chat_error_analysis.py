"""create study chat error analysis

Revision ID: 7f2a1b9c4d6e
Revises: 4c430c36b1aa
Create Date: 2026-10-18 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "7f2a1b9c4d6e"
down_revision: Union[str, Sequence[str], None] = "4c430c36b1aa"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "study_chat_error_analysis",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("flashcard_set_id", sa.String(), nullable=False),
        sa.Column("original_message", sa.String(), nullable=False),
        sa.Column("corrected_message", sa.String(), nullable=True),
        sa.Column("language_errors", sa.JSON(), nullable=False),
        sa.Column("language_level", sa.String(), nullable=False),
        sa.Column("model_name", sa.String(), nullable=False),
        sa.Column("prompt_version", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["flashcard_set_id"],
            ["flashcard_sets.id"],
            name="fk_study_chat_error_analysis_flashcard_set_id",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("study_chat_error_analysis")
