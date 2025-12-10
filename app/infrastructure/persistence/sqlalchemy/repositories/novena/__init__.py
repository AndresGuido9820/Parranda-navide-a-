"""Novena repository implementation using Supabase."""

from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID

from supabase import Client

from app.domain.entities.novena_day import NovenaDay as DomainNovenaDay
from app.domain.entities.novena_day import NovenaDaySection as DomainNovenaDaySection
from app.domain.entities.novena_progress import (
    UserNovenaProgress as DomainNovenaProgress,
)
from app.infrastructure.persistence.sqlalchemy.supabase_helpers import (
    datetime_to_iso,
    table,
    to_datetime,
    to_uuid,
)


class NovenaRepository:
    """Supabase-backed Novena repository."""

    def __init__(self, client: Client):
        self.client = client

    # === NOVENA DAYS ===

    def create_day(self, day: DomainNovenaDay) -> DomainNovenaDay:
        """Create a new novena day."""
        now = datetime.now(timezone.utc)
        payload = {
            "id": str(day.day_id),
            "day_number": day.day_number,
            "title": day.title,
            "created_at": datetime_to_iso(day.created_at or now),
        }
        response = table(self.client, "novena_days").insert(payload).execute()
        record = response.data[0] if response.data else payload
        return self._to_domain_day(record)

    def get_day_by_id(self, day_id: UUID) -> Optional[DomainNovenaDay]:
        """Get novena day by ID."""
        response = (
            table(self.client, "novena_days")
            .select("*")
            .eq("id", str(day_id))
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return self._to_domain_day(response.data[0])

    def get_day_by_number(self, day_number: int) -> Optional[DomainNovenaDay]:
        """Get novena day by number."""
        response = (
            table(self.client, "novena_days")
            .select("*")
            .eq("day_number", day_number)
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return self._to_domain_day(response.data[0])

    def get_all_days(self) -> List[DomainNovenaDay]:
        """Get all novena days."""
        response = (
            table(self.client, "novena_days")
            .select("*")
            .order("day_number", desc=False)
            .execute()
        )
        return [self._to_domain_day(item) for item in response.data or []]

    def update_day(self, day: DomainNovenaDay) -> DomainNovenaDay:
        """Update a novena day."""
        table(self.client, "novena_days").update({"title": day.title}).eq(
            "id", str(day.day_id)
        ).execute()
        updated = self.get_day_by_id(day.day_id)
        return updated or day

    def delete_day(self, day_id: UUID) -> bool:
        """Delete a novena day."""
        response = (
            table(self.client, "novena_days")
            .delete()
            .eq("id", str(day_id))
            .execute()
        )
        return bool(response.data)

    # === NOVENA SECTIONS ===

    def create_section(
        self, section: DomainNovenaDaySection
    ) -> DomainNovenaDaySection:
        """Create a new section for a day."""
        payload = {
            "id": str(section.section_id),
            "day_id": str(section.day_id),
            "section_type": section.section_type,
            "position": section.position,
            "content_md": section.content_md,
        }
        response = table(self.client, "novena_day_sections").insert(payload).execute()
        record = response.data[0] if response.data else payload
        return self._to_domain_section(record)

    def get_sections_by_day(self, day_id: UUID) -> List[DomainNovenaDaySection]:
        """Get all sections for a day."""
        response = (
            table(self.client, "novena_day_sections")
            .select("*")
            .eq("day_id", str(day_id))
            .order("position", desc=False)
            .execute()
        )
        return [self._to_domain_section(item) for item in response.data or []]

    def get_section_by_id(
        self, section_id: UUID
    ) -> Optional[DomainNovenaDaySection]:
        """Get section by ID."""
        response = (
            table(self.client, "novena_day_sections")
            .select("*")
            .eq("id", str(section_id))
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return self._to_domain_section(response.data[0])

    def update_section(
        self, section: DomainNovenaDaySection
    ) -> DomainNovenaDaySection:
        """Update a section."""
        payload = {
            "section_type": section.section_type,
            "position": section.position,
            "content_md": section.content_md,
        }
        table(self.client, "novena_day_sections").update(payload).eq(
            "id", str(section.section_id)
        ).execute()
        updated = self.get_section_by_id(section.section_id)
        return updated or section

    def delete_section(self, section_id: UUID) -> bool:
        """Delete a section."""
        response = (
            table(self.client, "novena_day_sections")
            .delete()
            .eq("id", str(section_id))
            .execute()
        )
        return bool(response.data)

    # === USER PROGRESS ===

    def get_user_progress(self, user_id: UUID) -> List[DomainNovenaProgress]:
        """Get all progress for a user."""
        response = (
            table(self.client, "user_novena_progress")
            .select("*")
            .eq("user_id", str(user_id))
            .execute()
        )
        return [self._to_domain_progress(item) for item in response.data or []]

    def get_progress_for_day(
        self, user_id: UUID, day_id: UUID
    ) -> Optional[DomainNovenaProgress]:
        """Get user progress for a specific day."""
        response = (
            table(self.client, "user_novena_progress")
            .select("*")
            .eq("user_id", str(user_id))
            .eq("day_id", str(day_id))
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return self._to_domain_progress(response.data[0])

    def create_or_update_progress(
        self, progress: DomainNovenaProgress
    ) -> DomainNovenaProgress:
        """Create or update user progress."""
        existing = self.get_progress_for_day(progress.user_id, progress.day_id)

        payload = {
            "is_completed": progress.is_completed,
            "completed_at": datetime_to_iso(progress.completed_at),
            "last_read_at": datetime_to_iso(progress.last_read_at),
        }

        if existing:
            table(self.client, "user_novena_progress").update(payload).eq(
                "user_id", str(progress.user_id)
            ).eq("day_id", str(progress.day_id)).execute()
        else:
            create_payload = {
                "user_id": str(progress.user_id),
                "day_id": str(progress.day_id),
                **payload,
            }
            table(self.client, "user_novena_progress").insert(create_payload).execute()

        updated = self.get_progress_for_day(progress.user_id, progress.day_id)
        return updated or progress

    def mark_day_complete(
        self, user_id: UUID, day_id: UUID
    ) -> DomainNovenaProgress:
        """Mark a day as complete for a user."""
        now = datetime.now(timezone.utc)
        progress = self.get_progress_for_day(user_id, day_id)

        if progress:
            progress.is_completed = True
            progress.completed_at = now
            progress.last_read_at = now
            return self.create_or_update_progress(progress)

        new_progress = DomainNovenaProgress(
            user_id=user_id,
            day_id=day_id,
            is_completed=True,
            completed_at=now,
            last_read_at=now,
        )
        return self.create_or_update_progress(new_progress)

    def reset_user_progress(self, user_id: UUID) -> bool:
        """Reset all progress for a user."""
        table(self.client, "user_novena_progress").delete().eq(
            "user_id", str(user_id)
        ).execute()
        return True

    # === CONVERTERS ===

    def _to_domain_day(self, record) -> DomainNovenaDay:
        """Convert Supabase record to domain entity."""
        return DomainNovenaDay(
            day_id=to_uuid(record.get("id")),
            day_number=record.get("day_number"),
            title=record.get("title"),
            created_at=to_datetime(record.get("created_at")),
        )

    def _to_domain_section(self, record) -> DomainNovenaDaySection:
        """Convert Supabase record to domain entity."""
        return DomainNovenaDaySection(
            section_id=to_uuid(record.get("id")),
            day_id=to_uuid(record.get("day_id")),
            section_type=record.get("section_type"),
            position=record.get("position"),
            content_md=record.get("content_md"),
        )

    def _to_domain_progress(self, record) -> DomainNovenaProgress:
        """Convert Supabase record to domain entity."""
        return DomainNovenaProgress(
            user_id=to_uuid(record.get("user_id")),
            day_id=to_uuid(record.get("day_id")),
            is_completed=bool(record.get("is_completed", False)),
            completed_at=to_datetime(record.get("completed_at")),
            last_read_at=to_datetime(record.get("last_read_at")),
        )
