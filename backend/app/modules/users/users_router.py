from fastapi import APIRouter, Depends, HTTPException, status

from app.modules.users.user_model import User
from app.modules.users.user_schema import (
    LoginSchema,
    RegisterUserSchema,
    TokenResponseSchema,
    UserResponseSchema,
)
from app.modules.users.user_service import UserService
from app.modules.users.users_dependencies import (
    get_current_user,
    get_user_service,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=UserResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    data: RegisterUserSchema,
    service: UserService = Depends(get_user_service),
) -> UserResponseSchema:
    user = await service.register(data)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )
    return user


@router.post("/login", response_model=TokenResponseSchema)
async def login(
    data: LoginSchema,
    service: UserService = Depends(get_user_service),
) -> TokenResponseSchema:
    token = await service.authenticate(str(data.email), data.password)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token, expires_in = token
    return TokenResponseSchema(
        access_token=access_token,
        expires_in=expires_in,
    )


@router.get("/me", response_model=UserResponseSchema)
async def get_me(
    current_user: User = Depends(get_current_user),
) -> UserResponseSchema:
    return current_user
