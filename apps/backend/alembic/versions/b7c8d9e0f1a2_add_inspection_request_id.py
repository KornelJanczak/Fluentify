"""add inspection request id

Revision ID: b7c8d9e0f1a2
Revises: a1b2c3d4e5f6
Create Date: 2026-11-05 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b7c8d9e0f1a2"
down_revision: Union[str, Sequence[str], None] = "a1b2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "study_chat_error_analysis",
        sa.Column("inspection_request_id", sa.String(), nullable=True),
    )
    op.create_index(
        "ix_study_chat_error_analysis_inspection_request_id",
        "study_chat_error_analysis",
        ["inspection_request_id"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_study_chat_error_analysis_inspection_request_id",
        table_name="study_chat_error_analysis",
    )
    op.drop_column("study_chat_error_analysis", "inspection_request_id")
