"""Game models."""

import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..base import Base


class UserGameStats(Base):
    """User game statistics model."""

    __tablename__ = "user_game_stats"
    __table_args__ = {"schema": "parranda"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("parranda.users.id", ondelete="CASCADE"),
        nullable=False,
    )
    game_type = Column(String(50), nullable=False)
    games_played = Column(Integer, default=0, nullable=False)
    games_won = Column(Integer, default=0, nullable=False)
    best_score = Column(Integer)
    total_score = Column(Integer, default=0)
    last_played_at = Column(DateTime(timezone=True))
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationship
    user = relationship("User", back_populates="game_stats")


class AnoViejoConfig(Base):
    """Año Viejo doll configuration model."""

    __tablename__ = "ano_viejo_configs"
    __table_args__ = {"schema": "parranda"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("parranda.users.id", ondelete="CASCADE"),
        nullable=False,
    )
    name = Column(Text)
    config_json = Column(JSONB, nullable=False)
    is_burned = Column(Boolean, default=False, nullable=False)
    burned_at = Column(DateTime(timezone=True))
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationship
    user = relationship("User", back_populates="ano_viejo_configs")
