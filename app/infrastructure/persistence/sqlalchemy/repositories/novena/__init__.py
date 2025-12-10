"""Novena repository implementation."""

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.domain.entities.novena_day import NovenaDay as DomainNovenaDay
from app.domain.entities.novena_day import NovenaDaySection as DomainNovenaDaySection
from app.domain.entities.novena_progress import (
    UserNovenaProgress as DomainNovenaProgress,
)

from ...models.novena import NovenaDay as NovenaDayORM
from ...models.novena import NovenaDaySection as NovenaDaySectionORM
from ...models.novena import UserNovenaProgress as UserNovenaProgressORM


class NovenaRepository:
    """Novena repository implementation."""

    def __init__(self, db: Session):
        self.db = db

    # === NOVENA DAYS ===

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

    def get_day_by_id(self, day_id: UUID) -> Optional[DomainNovenaDay]:
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

    def update_day(self, day: DomainNovenaDay) -> DomainNovenaDay:
        """Update a novena day."""
        stmt = select(NovenaDayORM).where(NovenaDayORM.id == day.day_id)
        day_orm = self.db.execute(stmt).scalar_one()

        day_orm.title = day.title

        self.db.commit()
        self.db.refresh(day_orm)
        return self._to_domain_day(day_orm)

    def delete_day(self, day_id: UUID) -> bool:
        """Delete a novena day."""
        stmt = select(NovenaDayORM).where(NovenaDayORM.id == day_id)
        day_orm = self.db.execute(stmt).scalar_one_or_none()

        if day_orm:
            self.db.delete(day_orm)
            self.db.commit()
            return True
        return False

    # === NOVENA SECTIONS ===

    def create_section(
        self, section: DomainNovenaDaySection
    ) -> DomainNovenaDaySection:
        """Create a new section for a day."""
        section_orm = NovenaDaySectionORM(
            id=section.section_id,
            day_id=section.day_id,
            section_type=section.section_type,
            position=section.position,
            content_md=section.content_md,
        )
        self.db.add(section_orm)
        self.db.commit()
        self.db.refresh(section_orm)
        return self._to_domain_section(section_orm)

    def get_sections_by_day(self, day_id: UUID) -> List[DomainNovenaDaySection]:
        """Get all sections for a day."""
        stmt = (
            select(NovenaDaySectionORM)
            .where(NovenaDaySectionORM.day_id == day_id)
            .order_by(NovenaDaySectionORM.position)
        )
        sections_orm = self.db.execute(stmt).scalars().all()
        return [self._to_domain_section(s) for s in sections_orm]

    def get_section_by_id(
        self, section_id: UUID
    ) -> Optional[DomainNovenaDaySection]:
        """Get section by ID."""
        stmt = select(NovenaDaySectionORM).where(
            NovenaDaySectionORM.id == section_id
        )
        section_orm = self.db.execute(stmt).scalar_one_or_none()
        return self._to_domain_section(section_orm) if section_orm else None

    def update_section(
        self, section: DomainNovenaDaySection
    ) -> DomainNovenaDaySection:
        """Update a section."""
        stmt = select(NovenaDaySectionORM).where(
            NovenaDaySectionORM.id == section.section_id
        )
        section_orm = self.db.execute(stmt).scalar_one()

        section_orm.section_type = section.section_type
        section_orm.position = section.position
        section_orm.content_md = section.content_md

        self.db.commit()
        self.db.refresh(section_orm)
        return self._to_domain_section(section_orm)

    def delete_section(self, section_id: UUID) -> bool:
        """Delete a section."""
        stmt = select(NovenaDaySectionORM).where(
            NovenaDaySectionORM.id == section_id
        )
        section_orm = self.db.execute(stmt).scalar_one_or_none()

        if section_orm:
            self.db.delete(section_orm)
            self.db.commit()
            return True
        return False

    # === USER PROGRESS ===

    def get_user_progress(self, user_id: UUID) -> List[DomainNovenaProgress]:
        """Get all progress for a user."""
        stmt = select(UserNovenaProgressORM).where(
            UserNovenaProgressORM.user_id == user_id
        )
        progress_orm = self.db.execute(stmt).scalars().all()
        return [self._to_domain_progress(p) for p in progress_orm]

    def get_progress_for_day(
        self, user_id: UUID, day_id: UUID
    ) -> Optional[DomainNovenaProgress]:
        """Get user progress for a specific day."""
        stmt = select(UserNovenaProgressORM).where(
            UserNovenaProgressORM.user_id == user_id,
            UserNovenaProgressORM.day_id == day_id,
        )
        progress_orm = self.db.execute(stmt).scalar_one_or_none()
        return self._to_domain_progress(progress_orm) if progress_orm else None

    def create_or_update_progress(
        self, progress: DomainNovenaProgress
    ) -> DomainNovenaProgress:
        """Create or update user progress."""
        stmt = select(UserNovenaProgressORM).where(
            UserNovenaProgressORM.user_id == progress.user_id,
            UserNovenaProgressORM.day_id == progress.day_id,
        )
        existing = self.db.execute(stmt).scalar_one_or_none()

        if existing:
            existing.is_completed = progress.is_completed
            existing.completed_at = progress.completed_at
            existing.last_read_at = progress.last_read_at
            self.db.commit()
            self.db.refresh(existing)
            return self._to_domain_progress(existing)
        else:
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

    def mark_day_complete(
        self, user_id: UUID, day_id: UUID
    ) -> DomainNovenaProgress:
        """Mark a day as complete for a user."""
        progress = self.get_progress_for_day(user_id, day_id)

        if progress:
            progress.is_completed = True
            progress.completed_at = datetime.now()
            progress.last_read_at = datetime.now()
            return self.create_or_update_progress(progress)
        else:
            new_progress = DomainNovenaProgress(
                user_id=user_id,
                day_id=day_id,
                is_completed=True,
                completed_at=datetime.now(),
                last_read_at=datetime.now(),
            )
            return self.create_or_update_progress(new_progress)

    def reset_user_progress(self, user_id: UUID) -> bool:
        """Reset all progress for a user."""
        stmt = delete(UserNovenaProgressORM).where(
            UserNovenaProgressORM.user_id == user_id
        )
        self.db.execute(stmt)
        self.db.commit()
        return True

    # === CONVERTERS ===

    def _to_domain_day(self, day_orm: NovenaDayORM) -> DomainNovenaDay:
        """Convert ORM to domain entity."""
        return DomainNovenaDay(
            day_id=day_orm.id,
            day_number=day_orm.day_number,
            title=day_orm.title,
            created_at=day_orm.created_at,
        )

    def _to_domain_section(
        self, section_orm: NovenaDaySectionORM
    ) -> DomainNovenaDaySection:
        """Convert ORM to domain entity."""
        return DomainNovenaDaySection(
            section_id=section_orm.id,
            day_id=section_orm.day_id,
            section_type=section_orm.section_type,
            position=section_orm.position,
            content_md=section_orm.content_md,
        )

    def _to_domain_progress(
        self, progress_orm: UserNovenaProgressORM
    ) -> DomainNovenaProgress:
        """Convert ORM to domain entity."""
        return DomainNovenaProgress(
            user_id=progress_orm.user_id,
            day_id=progress_orm.day_id,
            is_completed=progress_orm.is_completed,
            completed_at=progress_orm.completed_at,
            last_read_at=progress_orm.last_read_at,
        )
