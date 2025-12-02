"""User novena progress use cases."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from app.application.dtos.novenas import UserProgressListResponse, UserProgressResponse
from app.domain.entities.novena_progress import UserNovenaProgress
from app.infrastructure.persistence.sqlalchemy.repositories.novena import (
    NovenaRepository,
)


class GetUserProgressUseCase:
    """Get user progress use case."""

    def __init__(self, repository: NovenaRepository):
        self.repository = repository

    def execute(self, user_id: UUID) -> UserProgressListResponse:
        """Get all progress for a user."""
        all_days = self.repository.get_all_days()
        user_progress = self.repository.get_user_progress(user_id)

        # Create map of day_id -> progress
        progress_map = {str(p.day_id): p for p in user_progress}

        progress_list = []
        completed_count = 0

        for day in sorted(all_days, key=lambda d: d.day_number):
            progress = progress_map.get(str(day.day_id))
            is_completed = progress.is_completed if progress else False

            if is_completed:
                completed_count += 1

            progress_list.append(
                UserProgressResponse(
                    day_id=str(day.day_id),
                    day_number=day.day_number,
                    day_title=day.title,
                    is_completed=is_completed,
                    completed_at=progress.completed_at if progress else None,
                    last_read_at=progress.last_read_at if progress else None,
                )
            )

        return UserProgressListResponse(
            progress=progress_list,
            completed_count=completed_count,
            total_days=len(all_days),
        )

    def execute_for_day(
        self, user_id: UUID, day_number: int
    ) -> Optional[UserProgressResponse]:
        """Get progress for a specific day."""
        day = self.repository.get_day_by_number(day_number)
        if not day:
            return None

        progress = self.repository.get_progress_for_day(user_id, day.day_id)

        return UserProgressResponse(
            day_id=str(day.day_id),
            day_number=day.day_number,
            day_title=day.title,
            is_completed=progress.is_completed if progress else False,
            completed_at=progress.completed_at if progress else None,
            last_read_at=progress.last_read_at if progress else None,
        )


class MarkDayCompleteUseCase:
    """Mark day as complete use case."""

    def __init__(self, repository: NovenaRepository):
        self.repository = repository

    def execute(self, user_id: UUID, day_number: int) -> UserProgressResponse:
        """Mark a day as complete for a user."""
        day = self.repository.get_day_by_number(day_number)
        if not day:
            raise ValueError(f"Day {day_number} not found")

        # Get or create progress
        existing = self.repository.get_progress_for_day(user_id, day.day_id)

        if existing:
            existing.is_completed = True
            existing.completed_at = datetime.now()
            existing.last_read_at = datetime.now()
            progress = self.repository.create_or_update_progress(existing)
        else:
            new_progress = UserNovenaProgress(
                user_id=user_id,
                day_id=day.day_id,
                is_completed=True,
                completed_at=datetime.now(),
                last_read_at=datetime.now(),
            )
            progress = self.repository.create_or_update_progress(new_progress)

        return UserProgressResponse(
            day_id=str(day.day_id),
            day_number=day.day_number,
            day_title=day.title,
            is_completed=progress.is_completed,
            completed_at=progress.completed_at,
            last_read_at=progress.last_read_at,
        )


class UpdateProgressUseCase:
    """Update progress use case (e.g., track last read)."""

    def __init__(self, repository: NovenaRepository):
        self.repository = repository

    def execute(self, user_id: UUID, day_number: int) -> UserProgressResponse:
        """Update last_read_at for a day."""
        day = self.repository.get_day_by_number(day_number)
        if not day:
            raise ValueError(f"Day {day_number} not found")

        existing = self.repository.get_progress_for_day(user_id, day.day_id)

        if existing:
            existing.last_read_at = datetime.now()
            progress = self.repository.create_or_update_progress(existing)
        else:
            new_progress = UserNovenaProgress(
                user_id=user_id,
                day_id=day.day_id,
                is_completed=False,
                last_read_at=datetime.now(),
            )
            progress = self.repository.create_or_update_progress(new_progress)

        return UserProgressResponse(
            day_id=str(day.day_id),
            day_number=day.day_number,
            day_title=day.title,
            is_completed=progress.is_completed,
            completed_at=progress.completed_at,
            last_read_at=progress.last_read_at,
        )


class ResetProgressUseCase:
    """Reset user progress use case."""

    def __init__(self, repository: NovenaRepository):
        self.repository = repository

    def execute(self, user_id: UUID) -> bool:
        """Reset all progress for a user."""
        return self.repository.reset_user_progress(user_id)
