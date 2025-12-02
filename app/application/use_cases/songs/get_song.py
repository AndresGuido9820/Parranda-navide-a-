"""Get song use case."""

from uuid import UUID

from app.application.dtos.songs import SongResponse
from app.application.ports.repositories.song_repository import SongRepositoryPort


class SongNotFoundError(Exception):
    """Raised when song is not found."""

    pass


class GetSongUseCase:
    """Use case for getting a song by ID."""

    def __init__(self, repository: SongRepositoryPort):
        self.repository = repository

    def execute(self, song_id: UUID) -> SongResponse:
        """Execute the use case."""
        song = self.repository.get_by_id(song_id)

        if not song:
            raise SongNotFoundError(f"Song with ID {song_id} not found")

        return SongResponse(
            id=song.id,
            title=song.title,
            artist=song.artist,
            youtube_id=song.youtube_id,
            thumbnail_url=song.thumbnail_url,
            duration_seconds=song.duration_seconds,
            genre=song.genre,
            is_christmas=song.is_christmas,
            created_at=song.created_at,
            updated_at=song.updated_at,
        )

    def execute_by_youtube_id(self, youtube_id: str) -> SongResponse:
        """Get song by YouTube ID."""
        song = self.repository.get_by_youtube_id(youtube_id)

        if not song:
            raise SongNotFoundError(f"Song with YouTube ID {youtube_id} not found")

        return SongResponse(
            id=song.id,
            title=song.title,
            artist=song.artist,
            youtube_id=song.youtube_id,
            thumbnail_url=song.thumbnail_url,
            duration_seconds=song.duration_seconds,
            genre=song.genre,
            is_christmas=song.is_christmas,
            created_at=song.created_at,
            updated_at=song.updated_at,
        )

