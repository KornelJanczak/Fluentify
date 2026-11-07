import logging
from types import SimpleNamespace

import pytest

from app.logging_config import configure_logging
from app.modules.error_analysis.error_analysis_schema import InlineInspectorSchema
from app.modules.study_chat.chat_schema import StudyChatMessageSchema
from app.modules.study_chat.study_chat_router import study_chat_message


def test_configure_logging_sets_root_level() -> None:
    configure_logging("DEBUG")

    assert logging.getLogger().level == logging.DEBUG


@pytest.mark.asyncio
async def test_study_chat_logs_metadata_without_conversation_content(caplog) -> None:
    sensitive_message = "private learner message"
    sensitive_result = "private generated response"

    class FakeGraph:
        async def ainvoke(self, *_args, **_kwargs):
            return {
                "reply": sensitive_result,
                "inline_inspector": InlineInspectorSchema(
                    original_message=sensitive_message,
                ),
            }

    caplog.set_level(
        logging.INFO, logger="app.modules.study_chat.study_chat_router")

    await study_chat_message(
        flashcard_set_id="set-123",
        data=StudyChatMessageSchema(message=sensitive_message),
        service=SimpleNamespace(),
        graph=FakeGraph(),
        current_user=SimpleNamespace(id="user-123"),
    )

    logged_text = " ".join(record.getMessage() for record in caplog.records)

    assert "user_id=user-123" in logged_text
    assert "flashcard_set_id=set-123" in logged_text
    assert sensitive_message not in logged_text
    assert sensitive_result not in logged_text
