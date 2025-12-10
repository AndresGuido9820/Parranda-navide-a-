"""Music models."""

import uuid

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..base import Base


class Song(Base):
    """Song model for Christmas music library."""

    __tablename__ = "songs"
    __table_args__ = {"schema": "parranda"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    youtube_video_id = Column(String(20), unique=True, nullable=False)
    title = Column(Text, nullable=False)
    artist = Column(Text, nullable=False)
    thumbnail_url = Column(Text)
    duration_seconds = Column(Integer)
    genre = Column(Text)
    is_christmas = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    playlists = relationship(
        "PlaylistSong",
        back_populates="song",
        cascade="all, delete-orphan",
    )
    favorited_by = relationship(
        "UserFavoriteSong",
        back_populates="song",
        cascade="all, delete-orphan",
    )


class Playlist(Base):
    """User playlist model."""

    __tablename__ = "playlists"
    __table_args__ = {"schema": "parranda"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("parranda.users.id", ondelete="CASCADE"),
        nullable=False,
    )
    name = Column(Text, nullable=False)
    description = Column(Text)
    is_public = Column(Boolean, default=False, nullable=False)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    user = relationship("User", back_populates="playlists")
    songs = relationship(
        "PlaylistSong",
        back_populates="playlist",
        cascade="all, delete-orphan",
        order_by="PlaylistSong.position",
    )


class PlaylistSong(Base):
    """Association table for playlist songs."""

    __tablename__ = "playlist_songs"
    __table_args__ = {"schema": "parranda"}

    playlist_id = Column(
        UUID(as_uuid=True),
        ForeignKey("parranda.playlists.id", ondelete="CASCADE"),
        primary_key=True,
    )
    song_id = Column(
        UUID(as_uuid=True),
        ForeignKey("parranda.songs.id", ondelete="CASCADE"),
        primary_key=True,
    )
    position = Column(Integer, nullable=False)
    added_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    playlist = relationship("Playlist", back_populates="songs")
    song = relationship("Song", back_populates="playlists")


class UserFavoriteSong(Base):
    """User favorite song model."""

    __tablename__ = "user_favorite_songs"
    __table_args__ = {"schema": "parranda"}

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("parranda.users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    song_id = Column(
        UUID(as_uuid=True),
        ForeignKey("parranda.songs.id", ondelete="CASCADE"),
        primary_key=True,
    )
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    user = relationship("User", back_populates="favorite_songs")
    song = relationship("Song", back_populates="favorited_by")

