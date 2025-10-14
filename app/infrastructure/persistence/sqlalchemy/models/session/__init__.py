"""Session model."""

import uuid

from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..base import Base


class Session(Base):
    """User session model."""

    __tablename__ = "sessions"
    __table_args__ = {"schema": "parranda"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("parranda.users.id"), nullable=False
    )
    session_token_hash = Column(Text, unique=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    expires_at = Column(DateTime(timezone=True), nullable=False)
    user_agent = Column(Text)
    ip_address = Column(String(45))  # IPv6 compatible

    # Relationship
    user = relationship("User", back_populates="sessions")
