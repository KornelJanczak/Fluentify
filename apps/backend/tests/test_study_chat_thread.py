from app.modules.study_chat.study_chat_thread import (
    get_study_chat_thread_id,
)


def test_study_chat_thread_id_matches_flashcard_set_id():
    thread_id = get_study_chat_thread_id("set-123")
    assert thread_id == "set-123"

