"""Update song use case."""

from datetime import datetime, timezone
from uuid import UUID

from app.application.dtos.songs import SongResponse, UpdateSongRequest
from app.application.ports.repositories.song_repository import SongRepositoryPort
from app.application.use_cases.songs.get_song import SongNotFoundError


class UpdateSongUseCase:
    """Use case for updating a song."""

    def __init__(self, repository: SongRepositoryPort):
        self.repository = repository

    def execute(self, song_id: UUID, request: UpdateSongRequest) -> SongResponse:
        """Execute the use case."""
        song = self.repository.get_by_id(song_id)

        if not song:
            raise SongNotFoundError(f"Song with ID {song_id} not found")

        # Update only provided fields
        if request.title is not None:
            song.title = request.title
        if request.artist is not None:
            song.artist = request.artist
        if request.youtube_id is not None:
            song.youtube_id = request.youtube_id
        if request.thumbnail_url is not None:
            song.thumbnail_url = request.thumbnail_url
        if request.duration_seconds is not None:
            song.duration_seconds = request.duration_seconds
        if request.genre is not None:
            song.genre = request.genre
        if request.is_christmas is not None:
            song.is_christmas = request.is_christmas

        song.updated_at = datetime.now(timezone.utc)

        updated_song = self.repository.update(song)

        return SongResponse(
            id=updated_song.id,
            title=updated_song.title,
            artist=updated_song.artist,
            youtube_id=updated_song.youtube_id,
            thumbnail_url=updated_song.thumbnail_url,
            duration_seconds=updated_song.duration_seconds,
            genre=updated_song.genre,
            is_christmas=updated_song.is_christmas,
            created_at=updated_song.created_at,
            updated_at=updated_song.updated_at,
        )

