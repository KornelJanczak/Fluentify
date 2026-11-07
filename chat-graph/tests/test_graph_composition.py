from types import SimpleNamespace

import pytest

from chat_graph import graph as graph_module
from chat_graph.dependencies import StudyChatWorkflowContext


@pytest.mark.parametrize("token", ["token-123", "token-456"])
def test_factory_composes_graph_from_authenticated_user(
    monkeypatch: pytest.MonkeyPatch,
    token: str,
) -> None:
    captured: dict[str, str] = {}

    def fake_create_context(access_token: str) -> StudyChatWorkflowContext:
        captured["access_token"] = access_token
        return SimpleNamespace()

    monkeypatch.setattr(
        graph_module, "create_workflow_context", fake_create_context)

    runtime = SimpleNamespace(
        ensure_user=lambda: {"identity": "user-123", "access_token": token},
    )

    graph = graph_module.make_study_chat_graph(runtime)

    assert graph.name == "study_chat"
    assert captured["access_token"] == token
