"""Song repository implementation using Supabase."""

from typing import List, Optional
from uuid import UUID

from supabase import Client

from app.application.ports.repositories.song_repository import SongRepositoryPort
from app.domain.entities.song import Song
from app.infrastructure.persistence.sqlalchemy.supabase_helpers import (
    page_range,
    table,
    to_datetime,
    to_uuid,
)


class SongRepository(SongRepositoryPort):
    """Supabase implementation of song repository."""

    def __init__(self, client: Client):
        self.client = client

    def create(self, song: Song) -> Song:
        """Create a new song."""
        payload = {
            "id": str(song.id),
            "title": song.title,
            "artist": song.artist,
            "youtube_video_id": song.youtube_id,
            "thumbnail_url": song.thumbnail_url,
            "duration_seconds": song.duration_seconds,
            "genre": song.genre,
            "is_christmas": song.is_christmas,
            "is_active": True,
        }
        response = table(self.client, "songs").insert(payload).execute()
        record = response.data[0] if response.data else payload
        return self._to_domain(record)

    def get_by_id(self, song_id: UUID) -> Optional[Song]:
        """Get song by ID."""
        response = (
            table(self.client, "songs")
            .select("*")
            .eq("id", str(song_id))
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return self._to_domain(response.data[0])

    def get_by_youtube_id(self, youtube_id: str) -> Optional[Song]:
        """Get song by YouTube ID."""
        response = (
            table(self.client, "songs")
            .select("*")
            .eq("youtube_video_id", youtube_id)
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return self._to_domain(response.data[0])

    def get_all(
        self,
        page: int = 1,
        page_size: int = 10,
        genre: Optional[str] = None,
        is_christmas: Optional[bool] = None,
        search: Optional[str] = None,
    ) -> tuple[List[Song], int]:
        """Get all songs with pagination and filters."""
        query = table(self.client, "songs").select("*", count="exact")

        if genre:
            query = query.eq("genre", genre)
        if is_christmas is not None:
            query = query.eq("is_christmas", is_christmas)
        if search:
            like = f"%{search}%"
            query = query.or_(f"title.ilike.{like},artist.ilike.{like}")

        start, end = page_range(page, page_size)
        response = query.order("created_at", desc=True).range(start, end).execute()

        records = response.data or []
        total = response.count or 0

        return [self._to_domain(r) for r in records], total

    def update(self, song: Song) -> Song:
        """Update an existing song."""
        payload = {
            "title": song.title,
            "artist": song.artist,
            "youtube_video_id": song.youtube_id,
            "thumbnail_url": song.thumbnail_url,
            "duration_seconds": song.duration_seconds,
            "genre": song.genre,
            "is_christmas": song.is_christmas,
        }
        table(self.client, "songs").update(payload).eq("id", str(song.id)).execute()

        updated = self.get_by_id(song.id)
        return updated or song

    def delete(self, song_id: UUID) -> bool:
        """Delete a song by ID."""
        response = (
            table(self.client, "songs").delete().eq("id", str(song_id)).execute()
        )
        return bool(response.data)

    def _to_domain(self, record) -> Song:
        """Convert Supabase record to domain entity."""
        return Song(
            id=to_uuid(record.get("id")),
            title=record.get("title"),
            artist=record.get("artist"),
            youtube_id=record.get("youtube_video_id"),
            thumbnail_url=record.get("thumbnail_url"),
            duration_seconds=record.get("duration_seconds"),
            genre=record.get("genre"),
            is_christmas=bool(record.get("is_christmas", True)),
            created_at=to_datetime(record.get("created_at")),
            updated_at=to_datetime(record.get("updated_at")) or to_datetime(
                record.get("created_at")
            ),
        )

