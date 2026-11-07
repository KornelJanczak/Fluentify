import uuid
from app.modules.study_chat.study_chat_thread import (
    get_study_chat_thread_id,
)


def test_study_chat_thread_id_is_valid_uuidv5():
    thread_id = get_study_chat_thread_id("user-123", "set-123")
    parsed = uuid.UUID(thread_id)
    assert parsed.version == 5
    assert str(parsed) == "9ccd97f5-22ac-51d5-b824-8c75926934e7"


def test_study_chat_thread_id_is_deterministic():
    id1 = get_study_chat_thread_id("user-abc", "set-xyz")
    id2 = get_study_chat_thread_id("user-abc", "set-xyz")
    assert id1 == id2


def test_study_chat_thread_id_is_distinct_for_different_inputs():
    id1 = get_study_chat_thread_id("user-1", "set-1")
    id2 = get_study_chat_thread_id("user-1", "set-2")
    id3 = get_study_chat_thread_id("user-2", "set-1")
    assert id1 != id2
    assert id1 != id3
