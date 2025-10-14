"""User model."""

import uuid

from sqlalchemy import Boolean, Column, DateTime, Text
from sqlalchemy.dialects.postgresql import CITEXT, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..base import Base


class User(Base):
    """User model."""

    __tablename__ = "users"
    __table_args__ = {"schema": "parranda"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(CITEXT, unique=True, nullable=False)
    full_name = Column(Text)
    alias = Column(Text, unique=True)
    phone = Column(Text)
    password_hash = Column(Text)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    sessions = relationship("Session", back_populates="user")
    novena_progress = relationship("UserNovenaProgress", back_populates="user")
