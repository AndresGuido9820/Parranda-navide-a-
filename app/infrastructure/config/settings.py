"""Settings configuration for Parranda Navideña."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    # Database
    database_url: str = (
        "postgresql://parranda_user:parranda_pass@localhost:5433/parranda"
    )

    # JWT Authentication
    jwt_secret: str = "your-jwt-secret-here-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440

    # URLs
    frontend_url: str = "http://localhost:5173"

    # Environment
    environment: str = "development"
    debug: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
