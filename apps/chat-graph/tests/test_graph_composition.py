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


def test_factory_handles_proxy_user_and_unauthenticated_runtime(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    captured: dict[str, str] = {}

    def fake_create_context(access_token: str) -> StudyChatWorkflowContext:
        captured["access_token"] = access_token
        return SimpleNamespace(access_token=access_token)

    monkeypatch.setattr(
        graph_module, "create_workflow_context", fake_create_context
    )

    class FakeProxyUser:
        def get(self, key: str, default: object = None) -> object:
            if key == "access_token":
                return "token-from-proxy"
            return default

    # 1. ProxyUser
    proxy_runtime = SimpleNamespace(ensure_user=lambda: FakeProxyUser())
    graph = graph_module.make_study_chat_graph(proxy_runtime)
    assert graph.name == "study_chat"
    assert captured["access_token"] == "token-from-proxy"

    # 2. Unauthenticated (ensure_user raises PermissionError)
    def failing_ensure_user():
        raise PermissionError("No authenticated user")

    unauthenticated_runtime = SimpleNamespace(ensure_user=failing_ensure_user)
    graph2 = graph_module.make_study_chat_graph(unauthenticated_runtime)
    assert graph2.name == "study_chat"
    assert captured["access_token"] == ""

