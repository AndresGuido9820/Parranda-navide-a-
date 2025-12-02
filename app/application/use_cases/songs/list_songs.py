"""List songs use case."""

import math
from typing import Optional

from app.application.dtos.songs import SongListResponse, SongResponse
from app.application.ports.repositories.song_repository import SongRepositoryPort


class ListSongsUseCase:
    """Use case for listing songs with filters."""

    def __init__(self, repository: SongRepositoryPort):
        self.repository = repository

    def execute(
        self,
        page: int = 1,
        page_size: int = 10,
        genre: Optional[str] = None,
        is_christmas: Optional[bool] = None,
        search: Optional[str] = None,
    ) -> SongListResponse:
        """Execute the use case."""
        songs, total = self.repository.get_all(
            page=page,
            page_size=page_size,
            genre=genre,
            is_christmas=is_christmas,
            search=search,
        )

        items = [
            SongResponse(
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
            for song in songs
        ]

        total_pages = max(1, math.ceil(total / page_size))

        return SongListResponse(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

