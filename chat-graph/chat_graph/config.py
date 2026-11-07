from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    backend_api_url: str = "http://localhost:8000"
    database_url: str
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    openai_api_key: str
    openai_model: str = "gpt-4o"
    openai_temperature: float = 0.7
    openai_timeout: int = 60
    model_config = SettingsConfigDict(
        env_file=("../backend/.env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
