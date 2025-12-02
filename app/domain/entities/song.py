"""Song domain entity."""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from uuid import UUID


@dataclass
class Song:
    """Song domain entity."""

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

    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return {
            "id": str(self.id),
            "title": self.title,
            "artist": self.artist,
            "youtube_id": self.youtube_id,
            "thumbnail_url": self.thumbnail_url,
            "duration_seconds": self.duration_seconds,
            "genre": self.genre,
            "is_christmas": self.is_christmas,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

