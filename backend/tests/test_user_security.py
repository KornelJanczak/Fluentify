import jwt

from app.config import settings
from app.modules.users.user_security import (
    create_access_token,
    get_user_id_from_token,
    hash_password,
    verify_password,
)


def test_password_hash_can_be_verified() -> None:
    password_digest = hash_password("correct horse battery staple")

    assert password_digest != "correct horse battery staple"
    assert verify_password("correct horse battery staple", password_digest)
    assert not verify_password("wrong password", password_digest)


def test_access_token_contains_user_id(monkeypatch) -> None:
    monkeypatch.setattr(settings, "jwt_secret_key", "test-secret")
    token, expires_in = create_access_token("user-123")

    assert expires_in == settings.jwt_expiration_minutes * 60
    assert get_user_id_from_token(token) == "user-123"


def test_invalid_access_token_is_rejected(monkeypatch) -> None:
    monkeypatch.setattr(settings, "jwt_secret_key", "test-secret")
    token = jwt.encode(
        {"sub": "user-123"},
        "different-secret",
        algorithm=settings.jwt_algorithm,
    )

    try:
        get_user_id_from_token(token)
    except jwt.InvalidTokenError:
        pass
    else:
        raise AssertionError("Invalid token should be rejected")
