"""Novena models."""

import uuid

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..base import Base


class NovenaDay(Base):
    """Novena day model."""

    __tablename__ = "novena_days"
    __table_args__ = {"schema": "parranda"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    day_number = Column(Integer, unique=True, nullable=False)
    title = Column(Text, nullable=False)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    sections = relationship(
        "NovenaDaySection", back_populates="day", cascade="all, delete-orphan"
    )
    user_progress = relationship(
        "UserNovenaProgress", back_populates="day", cascade="all, delete-orphan"
    )


class NovenaDaySection(Base):
    """Novena day section model."""

    __tablename__ = "novena_day_sections"
    __table_args__ = (
        UniqueConstraint(
            "day_id",
            "section_type",
            "position",
            name="novena_day_sections_day_id_section_type_position_key",
        ),
        {"schema": "parranda"},
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    day_id = Column(
        UUID(as_uuid=True), ForeignKey("parranda.novena_days.id"), nullable=False
    )
    section_type = Column(String(20), nullable=False)  # ORACIONES, GOZOS, VILLANCICOS
    position = Column(Integer, default=1, nullable=False)
    content_md = Column(Text, nullable=False)

    # Relationship
    day = relationship("NovenaDay", back_populates="sections")


class UserNovenaProgress(Base):
    """User novena progress model."""

    __tablename__ = "user_novena_progress"
    __table_args__ = {"schema": "parranda"}

    user_id = Column(
        UUID(as_uuid=True), ForeignKey("parranda.users.id"), primary_key=True
    )
    day_id = Column(
        UUID(as_uuid=True), ForeignKey("parranda.novena_days.id"), primary_key=True
    )
    is_completed = Column(Boolean, default=False, nullable=False)
    completed_at = Column(DateTime(timezone=True))
    last_read_at = Column(DateTime(timezone=True))

    # Relationships
    user = relationship("User", back_populates="novena_progress")
    day = relationship("NovenaDay", back_populates="user_progress")
