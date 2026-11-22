"""add users and flashcard set ownership

Revision ID: 9b8d7e6f5a4c
Revises: 7f2a1b9c4d6e
Create Date: 2026-10-24 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "9b8d7e6f5a4c"
down_revision: Union[str, Sequence[str], None] = "7f2a1b9c4d6e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("password_hash", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=False)
    op.add_column(
        "flashcard_sets",
        sa.Column("user_id", sa.String(), nullable=True),
    )
    op.execute(
        sa.text(
            """
            INSERT INTO users (id, email, password_hash, created_at)
            VALUES (
                'legacy-user',
                'legacy@fluentify.local',
                'legacy-account',
                CURRENT_TIMESTAMP
            )
            ON CONFLICT (id) DO NOTHING
            """
        )
    )
    op.execute(
        sa.text(
            "UPDATE flashcard_sets SET user_id = 'legacy-user' "
            "WHERE user_id IS NULL"
        )
    )
    op.alter_column("flashcard_sets", "user_id", nullable=False)
    op.create_index(
        "ix_flashcard_sets_user_id",
        "flashcard_sets",
        ["user_id"],
        unique=False,
    )
    op.create_foreign_key(
        "fk_flashcard_sets_user_id",
        "flashcard_sets",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    op.drop_constraint(
        "fk_flashcard_sets_user_id",
        "flashcard_sets",
        type_="foreignkey",
    )
    op.drop_index("ix_flashcard_sets_user_id", table_name="flashcard_sets")
    op.drop_column("flashcard_sets", "user_id")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
