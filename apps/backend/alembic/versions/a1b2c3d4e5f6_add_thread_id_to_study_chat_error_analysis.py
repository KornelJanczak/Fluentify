"""add thread id to study chat error analysis

Revision ID: a1b2c3d4e5f6
Revises: 7f2a1b9c4d6e
Create Date: 2026-11-03 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "9b8d7e6f5a4c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "study_chat_error_analysis",
        sa.Column("thread_id", sa.String(), nullable=True),
    )
    op.create_index(
        "ix_study_chat_error_analysis_thread_id",
        "study_chat_error_analysis",
        ["thread_id"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_study_chat_error_analysis_thread_id",
        table_name="study_chat_error_analysis",
    )
    op.drop_column("study_chat_error_analysis", "thread_id")
