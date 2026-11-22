import uuid

from app.modules.study_chat.study_chat_thread import (
    STUDY_CHAT_NAMESPACE,
    get_study_chat_thread_id,
)


def test_study_chat_thread_id_is_deterministic_uuidv5():
    thread_id_1 = get_study_chat_thread_id("user-1", "set-123")
    thread_id_2 = get_study_chat_thread_id("user-1", "set-123")
    thread_id_diff_user = get_study_chat_thread_id("user-2", "set-123")
    thread_id_diff_set = get_study_chat_thread_id("user-1", "set-456")

    assert thread_id_1 == thread_id_2
    assert thread_id_1 != thread_id_diff_user
    assert thread_id_1 != thread_id_diff_set

    parsed = uuid.UUID(thread_id_1)
    assert parsed.version == 5
    assert str(uuid.uuid5(STUDY_CHAT_NAMESPACE, "study_chat:user-1:set-123")) == thread_id_1
