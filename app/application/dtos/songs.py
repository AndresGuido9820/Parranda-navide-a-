"""Song DTOs."""

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


# === Request DTOs ===


class CreateSongRequest(BaseModel):
    """DTO for creating a song."""

    title: str = Field(..., min_length=1, max_length=255, example="Feliz Navidad")
    artist: str = Field(..., min_length=1, max_length=255, example="José Feliciano")
    youtube_id: str = Field(..., min_length=1, max_length=20, example="N8NcQzMQN_U")
    thumbnail_url: Optional[str] = Field(
        None, example="https://i.ytimg.com/vi/N8NcQzMQN_U/mqdefault.jpg"
    )
    duration_seconds: Optional[int] = Field(None, ge=0, example=180)
    genre: Optional[str] = Field(None, max_length=50, example="villancico")
    is_christmas: bool = Field(True)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Feliz Navidad",
                "artist": "José Feliciano",
                "youtube_id": "N8NcQzMQN_U",
                "thumbnail_url": "https://i.ytimg.com/vi/N8NcQzMQN_U/mqdefault.jpg",
                "duration_seconds": 180,
                "genre": "villancico",
                "is_christmas": True,
            }
        }


class UpdateSongRequest(BaseModel):
    """DTO for updating a song (partial)."""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    artist: Optional[str] = Field(None, min_length=1, max_length=255)
    youtube_id: Optional[str] = Field(None, min_length=1, max_length=20)
    thumbnail_url: Optional[str] = None
    duration_seconds: Optional[int] = Field(None, ge=0)
    genre: Optional[str] = Field(None, max_length=50)
    is_christmas: Optional[bool] = None


# === Response DTOs ===


class SongResponse(BaseModel):
    """DTO for song response."""

    id: UUID
    title: str
    artist: str
    youtube_id: str
    thumbnail_url: Optional[str]
    duration_seconds: Optional[int]
    genre: Optional[str]
    is_christmas: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SongListResponse(BaseModel):
    """DTO for paginated song list response."""

    items: List[SongResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

