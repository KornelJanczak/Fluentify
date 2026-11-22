from unittest.mock import AsyncMock, MagicMock
import pytest
from app.modules.study_chat.study_chat_router import study_chat_history
from app.modules.study_chat.study_chat_thread import get_study_chat_thread_id
from app.modules.users.user_model import User


@pytest.mark.asyncio
async def test_study_chat_history_fetches_from_langgraph():
    user = User(
        id="user-123",
        email="test@example.com",
        password_hash="hash",
    )
    langgraph_client = MagicMock()
    langgraph_client.threads.get_state = AsyncMock(
        return_value={
            "values": {
                "messages": [
                    {"role": "user", "content": "Hello!"},
                    {"role": "assistant", "content": "Hi there!"},
                ]
            }
        }
    )
    history_service = MagicMock()
    history_service.get_history = AsyncMock(
        return_value=[
            {"role": "user", "content": "Hello!", "inline_inspector": None},
            {"role": "assistant", "content": "Hi there!", "inline_inspector": None},
        ]
    )

    result = await study_chat_history(
        flashcard_set_id="set-123",
        current_user=user,
        langgraph_client=langgraph_client,
        history_service=history_service,
    )

    expected_thread_id = get_study_chat_thread_id("user-123", "set-123")
    langgraph_client.threads.get_state.assert_awaited_once_with(expected_thread_id)
    history_service.get_history.assert_awaited_once_with(
        flashcard_set_id="set-123",
        user_id="user-123",
        thread_id=expected_thread_id,
        messages=[
            {"role": "user", "content": "Hello!"},
            {"role": "assistant", "content": "Hi there!"},
        ],
    )
    assert len(result) == 2


@pytest.mark.asyncio
async def test_study_chat_history_service_parses_content_blocks():
    from app.modules.study_chat.study_chat_history_service import StudyChatHistoryService
    flashcard_set_service = MagicMock()
    flashcard_set_service.get_flashcard_set = AsyncMock(return_value=MagicMock())
    error_analysis_repo = MagicMock()
    error_analysis_repo.get_by_thread_id = AsyncMock(return_value=[])

    service = StudyChatHistoryService(
        flashcard_set_service=flashcard_set_service,
        error_analysis_repository=error_analysis_repo,
    )

    messages = [
        {"role": "user", "content": "I has an apple."},
        {"role": "assistant", "content": [{"type": "text", "text": "You mean 'I have an apple'."}]},
    ]

    history = await service.get_history(
        flashcard_set_id="set-1",
        user_id="user-1",
        thread_id="thread-1",
        messages=messages,
    )

    assert len(history) == 2
    assert history[0].role == "user"
    assert history[0].content == "I has an apple."
    assert history[1].role == "assistant"
    assert history[1].content == "You mean 'I have an apple'."


@pytest.mark.asyncio
async def test_study_chat_history_handles_missing_thread_gracefully():
    user = User(
        id="user-123",
        email="test@example.com",
        password_hash="hash",
    )
    langgraph_client = MagicMock()
    langgraph_client.threads.get_state = AsyncMock(side_effect=Exception("Thread not found"))
    history_service = MagicMock()
    history_service.get_history = AsyncMock(return_value=[])

    result = await study_chat_history(
        flashcard_set_id="set-missing",
        current_user=user,
        langgraph_client=langgraph_client,
        history_service=history_service,
    )

    expected_thread_id = get_study_chat_thread_id("user-123", "set-missing")
    langgraph_client.threads.get_state.assert_awaited_once_with(expected_thread_id)
    history_service.get_history.assert_awaited_once_with(
        flashcard_set_id="set-missing",
        user_id="user-123",
        thread_id=expected_thread_id,
        messages=[],
    )
    assert result == []


@pytest.mark.asyncio
async def test_study_chat_history_service_parses_content_blocks():
    from app.modules.study_chat.study_chat_history_service import StudyChatHistoryService
    flashcard_set_service = MagicMock()
    flashcard_set_service.get_flashcard_set = AsyncMock(return_value=MagicMock())
    error_analysis_repo = MagicMock()
    error_analysis_repo.get_by_thread_id = AsyncMock(return_value=[])

    service = StudyChatHistoryService(
        flashcard_set_service=flashcard_set_service,
        error_analysis_repository=error_analysis_repo,
    )

    messages = [
        {"role": "user", "content": "I has an apple."},
        {"role": "assistant", "content": [{"type": "text", "text": "You mean 'I have an apple'."}]},
    ]

    history = await service.get_history(
        flashcard_set_id="set-1",
        user_id="user-1",
        thread_id="thread-1",
        messages=messages,
    )

    assert len(history) == 2
    assert history[0].role == "user"
    assert history[0].content == "I has an apple."
    assert history[1].role == "assistant"
    assert history[1].content == "You mean 'I have an apple'."
