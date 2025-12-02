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

    # S3 Storage
    s3_bucket_name: str = "parranda-navidena-media-1764647392"
    s3_region: str = "us-east-1"

    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def s3_base_url(self) -> str:
        """Get S3 base URL."""
        return f"https://{self.s3_bucket_name}.s3.amazonaws.com"


settings = Settings()


# S3 folder paths
S3_SONGS_PATH = "songs"
S3_RECIPES_PATH = "recipes"
S3_AVATARS_PATH = "avatars"


def get_s3_url(path: str) -> str:
    """Get full S3 URL for a given path."""
    return f"{settings.s3_base_url}/{path}"


def get_song_thumbnail_url(filename: str) -> str:
    """Get S3 URL for a song thumbnail."""
    return f"{settings.s3_base_url}/{S3_SONGS_PATH}/{filename}"


def get_recipe_image_url(filename: str) -> str:
    """Get S3 URL for a recipe image."""
    return f"{settings.s3_base_url}/{S3_RECIPES_PATH}/{filename}"


def get_avatar_url(filename: str) -> str:
    """Get S3 URL for a user avatar."""
    return f"{settings.s3_base_url}/{S3_AVATARS_PATH}/{filename}"
