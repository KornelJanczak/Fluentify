import os

os.environ.setdefault("LANGGRAPH_RUNTIME_EDITION", "inmem")
os.environ.setdefault("REDIS_URI", "redis://localhost")
os.environ.setdefault("DATABASE_URI", "sqlite://")

import uuid
import jwt
import pytest
from starlette.exceptions import HTTPException

from chat_graph.auth import auth
from chat_graph.config import settings
from langgraph_sdk import Auth
from langgraph_runtime_inmem.database import connect
from langgraph_runtime_inmem.ops import Runs, Threads
import langgraph_api.auth.custom as custom


def _create_token(user_id: str) -> str:
    return jwt.encode(
        {"sub": user_id},
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


class DummyUser:
    def __init__(self, identity: str) -> None:
        self.identity = identity
        self.is_authenticated = True


@pytest.mark.asyncio
async def test_authenticate_valid_token() -> None:
    token = _create_token("user-test-123")
    user = await auth._authenticate_handler(f"Bearer {token}")
    assert user["identity"] == "user-test-123"
    assert user["access_token"] == token
    assert "study_chat" in user["permissions"]


@pytest.mark.asyncio
async def test_authenticate_invalid_token() -> None:
    with pytest.raises(Auth.exceptions.HTTPException) as exc_info:
        await auth._authenticate_handler("Bearer invalid-token")
    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_run_creation_sets_thread_owner_and_allows_read() -> None:
    custom.get_auth_instance = lambda: auth

    user_id = "user-abc-456"
    ctx = Auth.types.BaseAuthContext(user=DummyUser(user_id), permissions=["study_chat"])

    async with connect() as conn:
        assistant_id = uuid.uuid4()
        conn.store["assistants"].append({
            "assistant_id": assistant_id,
            "graph_id": "study_chat",
            "config": {},
            "metadata": {"created_by": "system"},
        })
        thread_id = uuid.uuid4()

        # Runs.put simulates run.start on a nonexistent thread with if_not_exists='create'
        run_gen = await Runs.put(
            conn,
            assistant_id,
            kwargs={},
            thread_id=thread_id,
            metadata={},
            prevent_insert_if_inflight=False,
            if_not_exists="create",
            ctx=ctx,
        )
        created_run = await anext(run_gen)
        assert created_run is not None

        # Verify thread in store was given the owner metadata
        stored_thread = next(
            (t for t in conn.store["threads"] if t["thread_id"] == thread_id),
            None,
        )
        assert stored_thread is not None
        assert stored_thread["metadata"].get("owner") == user_id

        # Verify Threads.get succeeds for the owner
        get_results = await Threads.get(conn, thread_id, ctx=ctx)
        fetched_thread = await anext(get_results)
        assert fetched_thread["thread_id"] == thread_id

        # Verify stream access check succeeds for the owner
        stream_filters = await Threads.Stream.check_thread_stream_auth(thread_id, ctx)
        assert stream_filters == {"owner": user_id}

        # Verify a different user cannot read the thread (404)
        different_ctx = Auth.types.BaseAuthContext(user=DummyUser("other-user"), permissions=["study_chat"])
        with pytest.raises(HTTPException) as err:
            other_results = await Threads.get(conn, thread_id, ctx=different_ctx)
            await anext(other_results)
        assert err.value.status_code == 404


@pytest.mark.asyncio
async def test_allow_authenticated_requests_for_studio_user() -> None:
    from chat_graph.auth import allow_authenticated_requests, scope_resource_access
    from langgraph_sdk.auth.types import StudioUser

    studio_user = StudioUser("langgraph-studio-user")
    ctx = Auth.types.BaseAuthContext(user=studio_user, permissions=[])
    result = await allow_authenticated_requests(ctx, {})
    assert result is True

    filters = await scope_resource_access(ctx, {})
    assert filters == {}
