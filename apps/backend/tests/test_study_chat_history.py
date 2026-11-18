from unittest.mock import AsyncMock, MagicMock
import pytest
from app.modules.study_chat.study_chat_router import study_chat_history
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

    langgraph_client.threads.get_state.assert_awaited_once_with("set-123")
    history_service.get_history.assert_awaited_once_with(
        flashcard_set_id="set-123",
        user_id="user-123",
        thread_id="set-123",
        messages=[
            {"role": "user", "content": "Hello!"},
            {"role": "assistant", "content": "Hi there!"},
        ],
    )
    assert len(result) == 2


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

    langgraph_client.threads.get_state.assert_awaited_once_with("set-missing")
    history_service.get_history.assert_awaited_once_with(
        flashcard_set_id="set-missing",
        user_id="user-123",
        thread_id="set-missing",
        messages=[],
    )
    assert result == []
