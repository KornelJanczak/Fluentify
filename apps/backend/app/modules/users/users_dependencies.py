from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.modules.users.user_model import User
from app.modules.users.user_repository import UserRepository
from app.modules.users.user_security import get_user_id_from_token
from app.modules.users.user_service import UserService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_user_repository(
    session: AsyncSession = Depends(get_db),
) -> UserRepository:
    return UserRepository(session)


def get_user_service(
    repository: UserRepository = Depends(get_user_repository),
) -> UserService:
    return UserService(repository)


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    repository: UserRepository = Depends(get_user_repository),
) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        user_id = get_user_id_from_token(token)
    except (jwt.InvalidTokenError, ValueError):
        raise credentials_error from None

    async with repository.session.begin():
        user = await repository.get_by_id(user_id)
    if user is None:
        raise credentials_error

    return user
