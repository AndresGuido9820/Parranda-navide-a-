"""Session repository implementation using Supabase."""

from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID

from supabase import Client

from app.domain.entities.session import Session as SessionEntity
from app.infrastructure.persistence.sqlalchemy.supabase_helpers import (
    datetime_to_iso,
    table,
    to_datetime,
    to_uuid,
)


class SessionRepository:
    """Supabase-backed session repository."""

    def __init__(self, client: Client):
        self.client = client

    def add(self, session: SessionEntity) -> None:
        """Add a new session."""
        now = datetime.now(timezone.utc)
        payload = {
            "id": str(session.session_id),
            "user_id": str(session.user_id),
            "session_token_hash": session.session_token_hash,
            "created_at": datetime_to_iso(session.created_at or now),
            "expires_at": datetime_to_iso(session.expires_at) if session.expires_at else None,
            "user_agent": session.user_agent,
            "ip_address": session.ip_address,
        }
        table(self.client, "sessions").insert(payload).execute()

    def get_by_id(self, session_id: UUID) -> Optional[SessionEntity]:
        """Get session by ID."""
        response = (
            table(self.client, "sessions")
            .select("*")
            .eq("id", str(session_id))
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return self._to_entity(response.data[0])

    def get_by_user_id(self, user_id: UUID) -> List[SessionEntity]:
        """Get all sessions for a user."""
        response = (
            table(self.client, "sessions")
            .select("*")
            .eq("user_id", str(user_id))
            .order("created_at", desc=True)
            .execute()
        )
        return [self._to_entity(item) for item in response.data or []]

    def get_by_token_hash(self, token_hash: str) -> Optional[SessionEntity]:
        """Get session by token hash."""
        response = (
            table(self.client, "sessions")
            .select("*")
            .eq("session_token_hash", token_hash)
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return self._to_entity(response.data[0])

    def get_active_sessions(self, user_id: UUID) -> List[SessionEntity]:
        """Get active (non-expired) sessions for a user."""
        now = datetime.now(timezone.utc).isoformat()
        response = (
            table(self.client, "sessions")
            .select("*")
            .eq("user_id", str(user_id))
            .gt("expires_at", now)
            .order("created_at", desc=True)
            .execute()
        )
        return [self._to_entity(item) for item in response.data or []]

    def update(self, session: SessionEntity) -> None:
        """Update an existing session."""
        payload = {
            "session_token_hash": session.session_token_hash,
            "expires_at": session.expires_at,
            "user_agent": session.user_agent,
            "ip_address": session.ip_address,
        }
        table(self.client, "sessions").update(payload).eq(
            "id", str(session.session_id)
        ).execute()

    def delete(self, session_id: UUID) -> None:
        """Delete a session."""
        table(self.client, "sessions").delete().eq("id", str(session_id)).execute()

    def delete_by_user_id(self, user_id: UUID) -> None:
        """Delete all sessions for a user."""
        table(self.client, "sessions").delete().eq("user_id", str(user_id)).execute()

    def delete_expired_sessions(self) -> int:
        """Delete all expired sessions and return count."""
        now = datetime.now(timezone.utc).isoformat()
        response = (
            table(self.client, "sessions")
            .delete()
            .lte("expires_at", now)
            .execute()
        )
        return len(response.data or [])

    def _to_entity(self, record) -> SessionEntity:
        """Convert Supabase record to domain entity."""
        return SessionEntity(
            session_id=to_uuid(record.get("id")),
            user_id=to_uuid(record.get("user_id")),
            session_token_hash=record.get("session_token_hash"),
            created_at=to_datetime(record.get("created_at")),
            expires_at=to_datetime(record.get("expires_at")),
            user_agent=record.get("user_agent"),
            ip_address=record.get("ip_address"),
        )
