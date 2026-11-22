import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.logging_config import configure_logging
from app.modules.flashcard_sets.flashcard_sets_router import (
    router as flashcard_sets_router,
)
from app.modules.flashcards.flashcards_router import router as flashcards_router
from app.modules.study_chat.study_chat_router import router as study_chat_router
from app.modules.study_chat.study_chat_internal_router import (
    router as study_chat_internal_router,
)
from app.modules.users.users_router import router as users_router

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    logger.info("Application is ready")
    try:
        yield
    finally:
        logger.info("Shutting down application")


def create_app() -> FastAPI:
    app = FastAPI(
        title="english-ai-tutor-api",
        version="0.1.0",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(flashcards_router)
    app.include_router(flashcard_sets_router)
    app.include_router(study_chat_router)
    app.include_router(study_chat_internal_router)
    app.include_router(users_router)

    @app.get("/health")
    async def health_check() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
