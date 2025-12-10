"""Song repository port (interface)."""

from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from app.domain.entities.song import Song


class SongRepositoryPort(ABC):
    """Abstract base class for song repository."""

    @abstractmethod
    def create(self, song: Song) -> Song:
        """Create a new song."""
        pass

    @abstractmethod
    def get_by_id(self, song_id: UUID) -> Optional[Song]:
        """Get song by ID."""
        pass

    @abstractmethod
    def get_by_youtube_id(self, youtube_id: str) -> Optional[Song]:
        """Get song by YouTube ID."""
        pass

    @abstractmethod
    def get_all(
        self,
        page: int = 1,
        page_size: int = 10,
        genre: Optional[str] = None,
        is_christmas: Optional[bool] = None,
        search: Optional[str] = None,
    ) -> tuple[List[Song], int]:
        """Get all songs with pagination and filters."""
        pass

    @abstractmethod
    def update(self, song: Song) -> Song:
        """Update an existing song."""
        pass

    @abstractmethod
    def delete(self, song_id: UUID) -> bool:
        """Delete a song by ID."""
        pass

