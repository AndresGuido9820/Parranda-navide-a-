"""Novena repository port (interface)."""

from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from app.domain.entities.novena_day import NovenaDay, NovenaDaySection
from app.domain.entities.novena_progress import UserNovenaProgress


class NovenaRepositoryPort(ABC):
    """Novena repository interface."""

    # === NOVENA DAYS ===

    @abstractmethod
    def create_day(self, day: NovenaDay) -> NovenaDay:
        """Create a new novena day."""
        pass

    @abstractmethod
    def get_day_by_id(self, day_id: UUID) -> Optional[NovenaDay]:
        """Get novena day by ID."""
        pass

    @abstractmethod
    def get_day_by_number(self, day_number: int) -> Optional[NovenaDay]:
        """Get novena day by number (1-9)."""
        pass

    @abstractmethod
    def get_all_days(self) -> List[NovenaDay]:
        """Get all novena days."""
        pass

    @abstractmethod
    def update_day(self, day: NovenaDay) -> NovenaDay:
        """Update a novena day."""
        pass

    @abstractmethod
    def delete_day(self, day_id: UUID) -> bool:
        """Delete a novena day."""
        pass

    # === NOVENA SECTIONS ===

    @abstractmethod
    def create_section(self, section: NovenaDaySection) -> NovenaDaySection:
        """Create a new section for a day."""
        pass

    @abstractmethod
    def get_sections_by_day(self, day_id: UUID) -> List[NovenaDaySection]:
        """Get all sections for a day."""
        pass

    @abstractmethod
    def get_section_by_id(self, section_id: UUID) -> Optional[NovenaDaySection]:
        """Get section by ID."""
        pass

    @abstractmethod
    def update_section(self, section: NovenaDaySection) -> NovenaDaySection:
        """Update a section."""
        pass

    @abstractmethod
    def delete_section(self, section_id: UUID) -> bool:
        """Delete a section."""
        pass

    # === USER PROGRESS ===

    @abstractmethod
    def get_user_progress(self, user_id: UUID) -> List[UserNovenaProgress]:
        """Get all progress for a user."""
        pass

    @abstractmethod
    def get_progress_for_day(
        self, user_id: UUID, day_id: UUID
    ) -> Optional[UserNovenaProgress]:
        """Get user progress for a specific day."""
        pass

    @abstractmethod
    def create_or_update_progress(
        self, progress: UserNovenaProgress
    ) -> UserNovenaProgress:
        """Create or update user progress."""
        pass

    @abstractmethod
    def mark_day_complete(
        self, user_id: UUID, day_id: UUID
    ) -> UserNovenaProgress:
        """Mark a day as complete for a user."""
        pass

    @abstractmethod
    def reset_user_progress(self, user_id: UUID) -> bool:
        """Reset all progress for a user."""
        pass

