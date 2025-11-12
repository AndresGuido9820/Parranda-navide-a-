"""Session domain entity."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4


@dataclass
class Session:
    """User session domain entity."""

    user_id: UUID
    session_token_hash: str
    expires_at: datetime
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    session_id: Optional[UUID] = field(default_factory=uuid4)
    created_at: Optional[datetime] = field(default_factory=datetime.now)

    def is_expired(self) -> bool:
        """Check if session is expired."""
        return datetime.now() > self.expires_at

    def __str__(self) -> str:
        return f"Session(id={self.session_id}, user_id={self.user_id})"

    def __repr__(self) -> str:
        return self.__str__()

    @classmethod
    def create(
        cls,
        user_id: UUID,
        session_token_hash: str,
        expires_at: datetime,
        user_agent: Optional[str] = None,
        ip_address: Optional[str] = None,
    ) -> "Session":
        """Create a new session instance."""
        return cls(
            user_id=user_id,
            session_token_hash=session_token_hash,
            expires_at=expires_at,
            user_agent=user_agent,
            ip_address=ip_address,
        )
