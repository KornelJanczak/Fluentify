import uuid

STUDY_CHAT_NAMESPACE = uuid.UUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")


def get_study_chat_thread_id(user_id: str, flashcard_set_id: str) -> str:
    """Generate a deterministic, RFC-4122 compliant UUIDv5 for a user and flashcard set study chat thread."""
    return str(
        uuid.uuid5(
            STUDY_CHAT_NAMESPACE,
            f"study_chat:{user_id}:{flashcard_set_id}",
        )
    )
