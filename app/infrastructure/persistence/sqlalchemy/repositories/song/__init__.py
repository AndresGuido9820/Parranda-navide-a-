"""Song repository implementation."""

from typing import List, Optional
from uuid import UUID

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.application.ports.repositories.song_repository import SongRepositoryPort
from app.domain.entities.song import Song
from app.infrastructure.persistence.sqlalchemy.models.music import Song as SongORM


class SongRepository(SongRepositoryPort):
    """SQLAlchemy implementation of song repository."""

    def __init__(self, db: Session):
        self.db = db

    def _to_domain(self, orm_song: SongORM) -> Song:
        """Convert ORM model to domain entity."""
        return Song(
            id=orm_song.id,
            title=orm_song.title,
            artist=orm_song.artist,
            youtube_id=orm_song.youtube_video_id,
            thumbnail_url=orm_song.thumbnail_url,
            duration_seconds=orm_song.duration_seconds,
            genre=orm_song.genre,
            is_christmas=orm_song.is_christmas,
            created_at=orm_song.created_at,
            updated_at=orm_song.created_at,  # ORM doesn't have updated_at
        )

    def _to_orm(self, song: Song) -> SongORM:
        """Convert domain entity to ORM model."""
        return SongORM(
            id=song.id,
            title=song.title,
            artist=song.artist,
            youtube_video_id=song.youtube_id,
            thumbnail_url=song.thumbnail_url,
            duration_seconds=song.duration_seconds,
            genre=song.genre,
            is_christmas=song.is_christmas,
        )

    def create(self, song: Song) -> Song:
        """Create a new song."""
        orm_song = self._to_orm(song)
        self.db.add(orm_song)
        self.db.commit()
        self.db.refresh(orm_song)
        return self._to_domain(orm_song)

    def get_by_id(self, song_id: UUID) -> Optional[Song]:
        """Get song by ID."""
        orm_song = self.db.query(SongORM).filter(SongORM.id == song_id).first()
        return self._to_domain(orm_song) if orm_song else None

    def get_by_youtube_id(self, youtube_id: str) -> Optional[Song]:
        """Get song by YouTube ID."""
        orm_song = (
            self.db.query(SongORM).filter(SongORM.youtube_video_id == youtube_id).first()
        )
        return self._to_domain(orm_song) if orm_song else None

    def get_all(
        self,
        page: int = 1,
        page_size: int = 10,
        genre: Optional[str] = None,
        is_christmas: Optional[bool] = None,
        search: Optional[str] = None,
    ) -> tuple[List[Song], int]:
        """Get all songs with pagination and filters."""
        query = self.db.query(SongORM)

        # Apply filters
        if genre:
            query = query.filter(SongORM.genre == genre)
        if is_christmas is not None:
            query = query.filter(SongORM.is_christmas == is_christmas)
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    SongORM.title.ilike(search_filter),
                    SongORM.artist.ilike(search_filter),
                )
            )

        # Get total count
        total = query.count()

        # Apply pagination
        offset = (page - 1) * page_size
        songs = query.offset(offset).limit(page_size).all()

        return [self._to_domain(s) for s in songs], total

    def update(self, song: Song) -> Song:
        """Update an existing song."""
        orm_song = self.db.query(SongORM).filter(SongORM.id == song.id).first()

        if orm_song:
            orm_song.title = song.title
            orm_song.artist = song.artist
            orm_song.youtube_video_id = song.youtube_id
            orm_song.thumbnail_url = song.thumbnail_url
            orm_song.duration_seconds = song.duration_seconds
            orm_song.genre = song.genre
            orm_song.is_christmas = song.is_christmas

            self.db.commit()
            self.db.refresh(orm_song)
            return self._to_domain(orm_song)

        return song

    def delete(self, song_id: UUID) -> bool:
        """Delete a song by ID."""
        orm_song = self.db.query(SongORM).filter(SongORM.id == song_id).first()
        if orm_song:
            self.db.delete(orm_song)
            self.db.commit()
            return True
        return False

