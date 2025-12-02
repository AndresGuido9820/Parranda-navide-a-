"""User domain entity."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from ..value_objects.email_address import EmailAddress


@dataclass
class User:
    """User domain entity."""

    email: EmailAddress
    password_hash: Optional[str] = None
    full_name: Optional[str] = None
    alias: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool = True
    user_id: Optional[UUID] = field(default_factory=uuid4)
    created_at: Optional[datetime] = field(default_factory=datetime.now)
    updated_at: Optional[datetime] = field(default_factory=datetime.now)

    def __str__(self) -> str:
        return f"User(id={self.user_id}, email={self.email})"

    def __repr__(self) -> str:
        return self.__str__()

    @classmethod
    def create(
        cls,
        email: EmailAddress,
        password_hash: Optional[str] = None,
        full_name: Optional[str] = None,
        alias: Optional[str] = None,
        phone: Optional[str] = None,
        is_active: bool = True,
    ) -> "User":
        """Create a new user instance."""
        return cls(
            email=email,
            password_hash=password_hash,
            full_name=full_name,
            alias=alias,
            phone=phone,
            is_active=is_active,
        )
