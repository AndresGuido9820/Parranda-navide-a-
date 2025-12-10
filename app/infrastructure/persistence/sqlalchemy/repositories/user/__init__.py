"""User repository implementation."""

from datetime import datetime
from typing import Any, Dict, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.domain.entities.user import User as DomainUser
from app.domain.value_objects.email_address import EmailAddress

from ...models.user import User as UserORM


class UserRepository:
    """User repository implementation."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, user: DomainUser) -> DomainUser:
        """Create a new user."""
        user_orm = UserORM(
            id=user.user_id,
            email=str(user.email),
            full_name=user.full_name,
            alias=user.alias,
            phone=user.phone,
            avatar_url=user.avatar_url,
            password_hash=user.password_hash,
            is_active=user.is_active,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )
        self.db.add(user_orm)
        self.db.commit()
        self.db.refresh(user_orm)
        return self._to_domain(user_orm)

    def get_by_id(self, user_id: str) -> Optional[DomainUser]:
        """Get user by ID."""
        stmt = select(UserORM).where(UserORM.id == user_id)
        user_orm = self.db.execute(stmt).scalar_one_or_none()
        return self._to_domain(user_orm) if user_orm else None

    def get_by_email(self, email: EmailAddress) -> Optional[DomainUser]:
        """Get user by email."""
        stmt = select(UserORM).where(UserORM.email == str(email))
        user_orm = self.db.execute(stmt).scalar_one_or_none()
        return self._to_domain(user_orm) if user_orm else None

    def get_by_alias(self, alias: str) -> Optional[DomainUser]:
        """Get user by alias."""
        stmt = select(UserORM).where(UserORM.alias == alias)
        user_orm = self.db.execute(stmt).scalar_one_or_none()
        return self._to_domain(user_orm) if user_orm else None

    def update(self, user_id: str, data: Dict[str, Any]) -> DomainUser:
        """Update user with partial data."""
        stmt = select(UserORM).where(UserORM.id == user_id)
        user_orm = self.db.execute(stmt).scalar_one_or_none()
        
        if not user_orm:
            raise ValueError("User not found")

        # Update only provided fields
        for key, value in data.items():
            if hasattr(user_orm, key):
                setattr(user_orm, key, value)
        
        user_orm.updated_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(user_orm)
        return self._to_domain(user_orm)

    def _to_domain(self, user_orm: UserORM) -> DomainUser:
        """Convert ORM to domain entity."""
        return DomainUser(
            user_id=user_orm.id,
            email=EmailAddress(user_orm.email),
            full_name=user_orm.full_name,
            alias=user_orm.alias,
            phone=user_orm.phone,
            avatar_url=user_orm.avatar_url,
            password_hash=user_orm.password_hash,
            is_active=user_orm.is_active,
            created_at=user_orm.created_at,
            updated_at=user_orm.updated_at,
        )
