"""User domain entity."""

from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from ..value_objects.email_address import EmailAddress


class User:
    """User domain entity."""
    
    def __init__(
        self,
        email: EmailAddress,
        password_hash: Optional[str] = None,
        full_name: Optional[str] = None,
        alias: Optional[str] = None,
        phone: Optional[str] = None,
        is_active: bool = True,
        id: Optional[UUID] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
    ):
        self.id = id or uuid4()
        self.email = email
        self.password_hash = password_hash
        self.full_name = full_name
        self.alias = alias
        self.phone = phone
        self.is_active = is_active
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()
    
    def __str__(self) -> str:
        return f"User(id={self.id}, email={self.email})"
    
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
