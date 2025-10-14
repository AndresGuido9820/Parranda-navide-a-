"""Novena repository implementation."""

from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.domain.entities.novena_day import NovenaDay as DomainNovenaDay
from app.domain.entities.novena_progress import (
    UserNovenaProgress as DomainNovenaProgress,
)

from ...models.novena import NovenaDay as NovenaDayORM
from ...models.novena import UserNovenaProgress as UserNovenaProgressORM


class NovenaRepository:
    """Novena repository implementation."""

    def __init__(self, db: Session):
        self.db = db

    # Novena Days
    def create_day(self, day: DomainNovenaDay) -> DomainNovenaDay:
        """Create a new novena day."""
        day_orm = NovenaDayORM(
            id=day.day_id,
            day_number=day.day_number,
            title=day.title,
            created_at=day.created_at,
        )
        self.db.add(day_orm)
        self.db.commit()
        self.db.refresh(day_orm)
        return self._to_domain_day(day_orm)

    def get_day_by_id(self, day_id: str) -> Optional[DomainNovenaDay]:
        """Get novena day by ID."""
        stmt = select(NovenaDayORM).where(NovenaDayORM.id == day_id)
        day_orm = self.db.execute(stmt).scalar_one_or_none()
        return self._to_domain_day(day_orm) if day_orm else None

    def get_day_by_number(self, day_number: int) -> Optional[DomainNovenaDay]:
        """Get novena day by number."""
        stmt = select(NovenaDayORM).where(NovenaDayORM.day_number == day_number)
        day_orm = self.db.execute(stmt).scalar_one_or_none()
        return self._to_domain_day(day_orm) if day_orm else None

    def get_all_days(self) -> List[DomainNovenaDay]:
        """Get all novena days."""
        stmt = select(NovenaDayORM).order_by(NovenaDayORM.day_number)
        days_orm = self.db.execute(stmt).scalars().all()
        return [self._to_domain_day(day_orm) for day_orm in days_orm]

    # User Progress
    def create_progress(self, progress: DomainNovenaProgress) -> DomainNovenaProgress:
        """Create user novena progress."""
        progress_orm = UserNovenaProgressORM(
            user_id=progress.user_id,
            day_id=progress.day_id,
            is_completed=progress.is_completed,
            completed_at=progress.completed_at,
            last_read_at=progress.last_read_at,
        )
        self.db.add(progress_orm)
        self.db.commit()
        self.db.refresh(progress_orm)
        return self._to_domain_progress(progress_orm)

    def get_progress(self, user_id: str, day_id: str) -> Optional[DomainNovenaProgress]:
        """Get user progress for a specific day."""
        stmt = select(UserNovenaProgressORM).where(
            UserNovenaProgressORM.user_id == user_id,
            UserNovenaProgressORM.day_id == day_id,
        )
        progress_orm = self.db.execute(stmt).scalar_one_or_none()
        return self._to_domain_progress(progress_orm) if progress_orm else None

    def get_user_progress(self, user_id: str) -> List[DomainNovenaProgress]:
        """Get all progress for a user."""
        stmt = select(UserNovenaProgressORM).where(
            UserNovenaProgressORM.user_id == user_id
        )
        progress_orm = self.db.execute(stmt).scalars().all()
        return [self._to_domain_progress(progress_orm) for progress_orm in progress_orm]

    def update_progress(self, progress: DomainNovenaProgress) -> DomainNovenaProgress:
        """Update user progress."""
        stmt = select(UserNovenaProgressORM).where(
            UserNovenaProgressORM.user_id == progress.user_id,
            UserNovenaProgressORM.day_id == progress.day_id,
        )
        progress_orm = self.db.execute(stmt).scalar_one()

        progress_orm.is_completed = progress.is_completed
        progress_orm.completed_at = progress.completed_at
        progress_orm.last_read_at = progress.last_read_at

        self.db.commit()
        self.db.refresh(progress_orm)
        return self._to_domain_progress(progress_orm)

    def _to_domain_day(self, day_orm: NovenaDayORM) -> DomainNovenaDay:
        """Convert ORM to domain entity."""
        return DomainNovenaDay(
            day_id=day_orm.id,
            day_number=day_orm.day_number,
            title=day_orm.title,
            created_at=day_orm.created_at,
        )

    def _to_domain_progress(
        self, progress_orm: UserNovenaProgressORM
    ) -> DomainNovenaProgress:
        """Convert ORM to domain entity."""
        return DomainNovenaProgress(
            id=progress_orm.user_id,  # Using user_id as id for composite key
            user_id=progress_orm.user_id,
            day_id=progress_orm.day_id,
            is_completed=progress_orm.is_completed,
            completed_at=progress_orm.completed_at,
            last_read_at=progress_orm.last_read_at,
        )
