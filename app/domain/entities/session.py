"""Session domain entity."""

from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4


class Session:
    """User session domain entity."""
    
    def __init__(
        self,
        user_id: UUID,
        session_token_hash: str,
        expires_at: datetime,
        user_agent: Optional[str] = None,
        ip_address: Optional[str] = None,
        id: Optional[UUID] = None,
        created_at: Optional[datetime] = None,
    ):
        self.id = id or uuid4()
        self.user_id = user_id
        self.session_token_hash = session_token_hash
        self.created_at = created_at or datetime.now()
        self.expires_at = expires_at
        self.user_agent = user_agent
        self.ip_address = ip_address
    
    def is_expired(self) -> bool:
        """Check if session is expired."""
        return datetime.now() > self.expires_at
    
    def __str__(self) -> str:
        return f"Session(id={self.id}, user_id={self.user_id})"
    
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