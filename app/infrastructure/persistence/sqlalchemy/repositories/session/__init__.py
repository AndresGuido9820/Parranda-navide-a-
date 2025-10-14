"""Session repository implementation using SQLAlchemy."""

from datetime import datetime, timezone
from typing import Optional, List
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.domain.entities.session import Session as SessionEntity
from ...models.session import Session as SessionORM


class SessionRepository:
    """Session repository implementation."""

    def __init__(self, db: Session):
        self.db = db

    def add(self, session: SessionEntity) -> None:
        """Add a new session."""
        session_orm = SessionORM(
            id=session.id,
            user_id=session.user_id,
            session_token_hash=session.session_token_hash,
            created_at=session.created_at,
            expires_at=session.expires_at,
            user_agent=session.user_agent,
            ip_address=session.ip_address,
        )
        self.db.add(session_orm)
        self.db.commit()

    def get_by_id(self, session_id: UUID) -> Optional[SessionEntity]:
        """Get session by ID."""
        session_orm = self.db.query(SessionORM).filter(SessionORM.id == session_id).first()
        if not session_orm:
            return None
        return self._to_entity(session_orm)

    def get_by_user_id(self, user_id: UUID) -> List[SessionEntity]:
        """Get all sessions for a user."""
        sessions_orm = self.db.query(SessionORM).filter(SessionORM.user_id == user_id).all()
        return [self._to_entity(session_orm) for session_orm in sessions_orm]

    def get_by_token_hash(self, token_hash: str) -> Optional[SessionEntity]:
        """Get session by token hash."""
        session_orm = self.db.query(SessionORM).filter(
            SessionORM.session_token_hash == token_hash
        ).first()
        if not session_orm:
            return None
        return self._to_entity(session_orm)

    def get_active_sessions(self, user_id: UUID) -> List[SessionEntity]:
        """Get active (non-expired) sessions for a user."""
        now = datetime.now(timezone.utc)
        sessions_orm = self.db.query(SessionORM).filter(
            and_(
                SessionORM.user_id == user_id,
                SessionORM.expires_at > now
            )
        ).all()
        return [self._to_entity(session_orm) for session_orm in sessions_orm]

    def update(self, session: SessionEntity) -> None:
        """Update an existing session."""
        session_orm = self.db.query(SessionORM).filter(SessionORM.id == session.id).first()
        if session_orm:
            session_orm.session_token_hash = session.session_token_hash
            session_orm.expires_at = session.expires_at
            session_orm.user_agent = session.user_agent
            session_orm.ip_address = session.ip_address
            self.db.commit()

    def delete(self, session_id: UUID) -> None:
        """Delete a session."""
        session_orm = self.db.query(SessionORM).filter(SessionORM.id == session_id).first()
        if session_orm:
            self.db.delete(session_orm)
            self.db.commit()

    def delete_by_user_id(self, user_id: UUID) -> None:
        """Delete all sessions for a user."""
        self.db.query(SessionORM).filter(SessionORM.user_id == user_id).delete()
        self.db.commit()

    def delete_expired_sessions(self) -> int:
        """Delete all expired sessions and return count."""
        now = datetime.now(timezone.utc)
        count = self.db.query(SessionORM).filter(SessionORM.expires_at <= now).count()
        self.db.query(SessionORM).filter(SessionORM.expires_at <= now).delete()
        self.db.commit()
        return count

    def _to_entity(self, session_orm: SessionORM) -> SessionEntity:
        """Convert ORM to domain entity."""
        return SessionEntity(
            id=session_orm.id,
            user_id=session_orm.user_id,
            session_token_hash=session_orm.session_token_hash,
            created_at=session_orm.created_at,
            expires_at=session_orm.expires_at,
            user_agent=session_orm.user_agent,
            ip_address=session_orm.ip_address,
        )