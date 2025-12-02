"""Create song use case."""

from datetime import datetime, timezone
from uuid import uuid4

from app.application.dtos.songs import CreateSongRequest, SongResponse
from app.application.ports.repositories.song_repository import SongRepositoryPort
from app.domain.entities.song import Song


class CreateSongUseCase:
    """Use case for creating a new song."""

    def __init__(self, repository: SongRepositoryPort):
        self.repository = repository

    def execute(self, request: CreateSongRequest) -> SongResponse:
        """Execute the use case."""
        now = datetime.now(timezone.utc)

        song = Song(
            id=uuid4(),
            title=request.title,
            artist=request.artist,
            youtube_id=request.youtube_id,
            thumbnail_url=request.thumbnail_url,
            duration_seconds=request.duration_seconds,
            genre=request.genre,
            is_christmas=request.is_christmas,
            created_at=now,
            updated_at=now,
        )

        created_song = self.repository.create(song)

        return SongResponse(
            id=created_song.id,
            title=created_song.title,
            artist=created_song.artist,
            youtube_id=created_song.youtube_id,
            thumbnail_url=created_song.thumbnail_url,
            duration_seconds=created_song.duration_seconds,
            genre=created_song.genre,
            is_christmas=created_song.is_christmas,
            created_at=created_song.created_at,
            updated_at=created_song.updated_at,
        )

