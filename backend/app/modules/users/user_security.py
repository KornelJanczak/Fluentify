from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash

from app.config import settings

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, password_digest: str) -> bool:
    return password_hash.verify(password, password_digest)


def create_access_token(user_id: str) -> tuple[str, int]:
    expires_in = settings.jwt_expiration_minutes * 60
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=expires_in)
    token = jwt.encode(
        {"sub": user_id, "exp": expires_at},
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )
    return token, expires_in


def get_user_id_from_token(token: str) -> str:
    payload = jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[settings.jwt_algorithm],
    )
    user_id = payload.get("sub")
    if not isinstance(user_id, str) or not user_id:
        raise ValueError("Token subject is missing")
    return user_id
