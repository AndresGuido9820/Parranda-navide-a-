"""Delete song use case."""

from uuid import UUID

from app.application.ports.repositories.song_repository import SongRepositoryPort
from app.application.use_cases.songs.get_song import SongNotFoundError


class DeleteSongUseCase:
    """Use case for deleting a song."""

    def __init__(self, repository: SongRepositoryPort):
        self.repository = repository

    def execute(self, song_id: UUID) -> bool:
        """Execute the use case."""
        song = self.repository.get_by_id(song_id)

        if not song:
            raise SongNotFoundError(f"Song with ID {song_id} not found")

        return self.repository.delete(song_id)

