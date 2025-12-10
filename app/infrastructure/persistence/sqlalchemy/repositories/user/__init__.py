"""User repository implementation using Supabase."""

from datetime import datetime, timezone
from typing import Any, Dict, Optional

from supabase import Client

from app.domain.entities.user import User as DomainUser
from app.domain.value_objects.email_address import EmailAddress
from app.infrastructure.persistence.sqlalchemy.supabase_helpers import (
    datetime_to_iso,
    table,
    to_datetime,
    to_uuid,
)


class UserRepository:
    """Supabase-backed user repository."""

    def __init__(self, client: Client):
        self.client = client

    def create(self, user: DomainUser) -> DomainUser:
        """Create a new user."""
        now = datetime.now(timezone.utc)
        data = {
            "id": str(user.user_id),
            "email": str(user.email),
            "full_name": user.full_name,
            "alias": user.alias,
            "phone": user.phone,
            "avatar_url": user.avatar_url,
            "password_hash": user.password_hash,
            "is_active": user.is_active,
            "created_at": datetime_to_iso(user.created_at or now),
            "updated_at": datetime_to_iso(user.updated_at or now),
        }
        response = table(self.client, "users").insert(data).execute()
        record = (response.data or [data])[0]
        return self._to_domain(record)

    def get_by_id(self, user_id: str) -> Optional[DomainUser]:
        """Get user by ID."""
        response = (
            table(self.client, "users")
            .select("*")
            .eq("id", str(user_id))
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return self._to_domain(response.data[0])

    def get_by_email(self, email: EmailAddress) -> Optional[DomainUser]:
        """Get user by email."""
        response = (
            table(self.client, "users")
            .select("*")
            .eq("email", str(email))
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return self._to_domain(response.data[0])

    def get_by_alias(self, alias: str) -> Optional[DomainUser]:
        """Get user by alias."""
        response = (
            table(self.client, "users")
            .select("*")
            .eq("alias", alias)
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return self._to_domain(response.data[0])

    def update(self, user_id: str, data: Dict[str, Any]) -> DomainUser:
        """Update user with partial data."""
        data = {k: v for k, v in data.items() if v is not None}
        # Convert datetime to ISO string if present
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = datetime_to_iso(value)
        data["updated_at"] = datetime_to_iso(datetime.now(timezone.utc))

        response = (
            table(self.client, "users")
            .update(data)
            .eq("id", str(user_id))
            .execute()
        )

        record = response.data[0] if response.data else None
        if not record:
            # If no returning payload, fetch the user to confirm update
            user = self.get_by_id(user_id)
            if not user:
                raise ValueError("User not found")
            return user

        return self._to_domain(record)

    def _to_domain(self, record: Dict[str, Any]) -> DomainUser:
        """Convert Supabase record to domain entity."""
        return DomainUser(
            user_id=to_uuid(record.get("id")),
            email=EmailAddress(record.get("email")),
            full_name=record.get("full_name"),
            alias=record.get("alias"),
            phone=record.get("phone"),
            avatar_url=record.get("avatar_url"),
            password_hash=record.get("password_hash"),
            is_active=bool(record.get("is_active", True)),
            created_at=to_datetime(record.get("created_at")),
            updated_at=to_datetime(record.get("updated_at")),
        )
