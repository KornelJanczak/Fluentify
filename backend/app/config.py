from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 60
    log_level: str = "INFO"
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore")

    openai_api_key: str
    openai_model: str = "gpt-4o-mini"
    openai_temperature: float = 0.0
    openai_timeout: int = 30


settings = Settings()
