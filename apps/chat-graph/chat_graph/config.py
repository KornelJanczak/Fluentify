from pathlib import Path

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_DIR = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    backend_api_url: str = Field(
        default="http://localhost:8000",
        validation_alias=AliasChoices(
            "BACKEND_API_URL",
            "BACKEND_URL",
            "backend_api_url",
            "backend_url",
        ),
    )
    database_url: str
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    openai_api_key: str
    openai_model: str = "gpt-4o"
    openai_temperature: float = 0.7
    openai_timeout: int = 60
    model_config = SettingsConfigDict(
        env_file=(ROOT_DIR / ".env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
