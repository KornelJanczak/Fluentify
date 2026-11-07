from uuid import uuid4

from app.modules.users.user_model import User
from app.modules.users.user_repository import UserRepository
from app.modules.users.user_schema import RegisterUserSchema
from app.modules.users.user_security import (
    create_access_token,
    hash_password,
    verify_password,
)


class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    async def register(self, data: RegisterUserSchema) -> User | None:
        email = str(data.email).lower()
        async with self.repository.session.begin():
            if await self.repository.get_by_email(email) is not None:
                return None

            return await self.repository.create(
                User(
                    id=str(uuid4()),
                    email=email,
                    password_hash=hash_password(data.password),
                )
            )

    async def authenticate(self, email: str, password: str) -> tuple[str, int] | None:
        user = await self.repository.get_by_email(email.lower())
        if user is None or not verify_password(password, user.password_hash):
            return None

        return create_access_token(user.id)

    async def get_by_id(self, user_id: str) -> User | None:
        return await self.repository.get_by_id(user_id)
