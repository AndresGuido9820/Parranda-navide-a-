"""User repository port."""

from abc import ABC, abstractmethod
from typing import Optional

from app.domain.entities.user import User
from app.domain.value_objects.email_address import EmailAddress


class UserRepository(ABC):
    """User repository interface."""

    @abstractmethod
    def create(self, user: User) -> User:
        """Create a new user."""
        pass

    @abstractmethod
    def get_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID."""
        pass

    @abstractmethod
    def get_by_email(self, email: EmailAddress) -> Optional[User]:
        """Get user by email."""
        pass

    @abstractmethod
    def get_by_alias(self, alias: str) -> Optional[User]:
        """Get user by alias."""
        pass

    @abstractmethod
    def update(self, user: User) -> User:
        """Update user."""
        pass
