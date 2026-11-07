from contextlib import asynccontextmanager

import pytest

from app.modules.users.user_schema import RegisterUserSchema
from app.modules.users.user_service import UserService


class FakeSession:
    @asynccontextmanager
    async def begin(self):
        yield


class FakeUserRepository:
    def __init__(self):
        self.session = FakeSession()
        self.users = {}

    async def get_by_email(self, email: str):
        return next((user for user in self.users.values() if user.email == email), None)

    async def create(self, user):
        self.users[user.id] = user
        return user

    async def get_by_id(self, user_id: str):
        return self.users.get(user_id)


@pytest.mark.asyncio
async def test_register_hashes_password_and_normalizes_email():
    repository = FakeUserRepository()
    service = UserService(repository)

    user = await service.register(
        RegisterUserSchema(email="Learner@Example.com", password="password123")
    )

    assert user is not None
    assert user.email == "learner@example.com"
    assert user.password_hash != "password123"


@pytest.mark.asyncio
async def test_register_rejects_duplicate_email():
    repository = FakeUserRepository()
    service = UserService(repository)
    data = RegisterUserSchema(
        email="learner@example.com", password="password123")

    assert await service.register(data) is not None
    assert await service.register(data) is None
