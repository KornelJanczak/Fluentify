import jwt
from langgraph_sdk import Auth

from chat_graph.config import settings


auth = Auth()


@auth.authenticate
async def authenticate(authorization: str | None) -> Auth.types.MinimalUserDict:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise Auth.exceptions.HTTPException(
            status_code=401,
            detail="Bearer authorization is required",
        )

    access_token = authorization[7:].strip()
    try:
        payload = jwt.decode(
            access_token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
    except jwt.InvalidTokenError as error:
        raise Auth.exceptions.HTTPException(
            status_code=401,
            detail="Invalid authorization token",
        ) from error

    user_id = payload.get("sub")
    if not isinstance(user_id, str) or not user_id:
        raise Auth.exceptions.HTTPException(
            status_code=401,
            detail="Token subject is missing",
        )

    return {
        "identity": user_id,
        "permissions": ["study_chat"],
        "access_token": access_token,
    }


@auth.on
async def allow_authenticated_requests(
    ctx: Auth.types.AuthContext,
    value: object,
) -> bool:
    del value
    return ctx.user is not None and ctx.user.is_authenticated


@auth.on.threads.create
async def set_thread_owner(
    ctx: Auth.types.AuthContext,
    value: Auth.types.on.threads.create.value,
) -> bool:
    metadata = value.setdefault("metadata", {})
    metadata["owner"] = ctx.user.identity
    return True


@auth.on.threads
async def scope_thread_access(
    ctx: Auth.types.AuthContext,
    value: object,
) -> Auth.types.FilterType:
    del value
    return {"owner": ctx.user.identity}
