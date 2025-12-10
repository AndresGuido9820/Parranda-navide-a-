"""Novena days use cases."""

from typing import List
from uuid import UUID

from app.application.dtos.novenas import (
    CreateNovenaDayRequest,
    NovenaDayListResponse,
    NovenaDayResponse,
    NovenaSectionResponse,
    UpdateNovenaDayRequest,
)
from app.domain.entities.novena_day import NovenaDay, NovenaDaySection
from app.infrastructure.persistence.sqlalchemy.repositories.novena import (
    NovenaRepository,
)


class NovenaDayNotFoundError(Exception):
    """Raised when novena day is not found."""

    pass


class CreateNovenaDayUseCase:
    """Create novena day use case."""

    def __init__(self, repository: NovenaRepository):
        self.repository = repository

    def execute(self, request: CreateNovenaDayRequest) -> NovenaDayResponse:
        """Create a new novena day with sections."""
        # Check if day already exists
        existing = self.repository.get_day_by_number(request.day_number)
        if existing:
            raise ValueError(f"Day {request.day_number} already exists")

        # Create day
        day = NovenaDay(
            day_number=request.day_number,
            title=request.title,
        )
        created_day = self.repository.create_day(day)

        # Create sections
        sections: List[NovenaSectionResponse] = []
        for section_req in request.sections:
            section = NovenaDaySection(
                day_id=created_day.day_id,
                section_type=section_req.section_type,
                position=section_req.position,
                content_md=section_req.content_md,
            )
            created_section = self.repository.create_section(section)
            sections.append(
                NovenaSectionResponse(
                    id=str(created_section.section_id),
                    section_type=created_section.section_type,
                    position=created_section.position,
                    content_md=created_section.content_md,
                )
            )

        return NovenaDayResponse(
            id=str(created_day.day_id),
            day_number=created_day.day_number,
            title=created_day.title,
            sections=sections,
            created_at=created_day.created_at,
        )


class GetNovenaDayUseCase:
    """Get novena day use case."""

    def __init__(self, repository: NovenaRepository):
        self.repository = repository

    def execute_by_id(self, day_id: UUID) -> NovenaDayResponse:
        """Get novena day by ID."""
        day = self.repository.get_day_by_id(day_id)
        if not day:
            raise NovenaDayNotFoundError(f"Day with ID {day_id} not found")

        sections = self.repository.get_sections_by_day(day.day_id)
        return self._to_response(day, sections)

    def execute_by_number(self, day_number: int) -> NovenaDayResponse:
        """Get novena day by number."""
        day = self.repository.get_day_by_number(day_number)
        if not day:
            raise NovenaDayNotFoundError(f"Day {day_number} not found")

        sections = self.repository.get_sections_by_day(day.day_id)
        return self._to_response(day, sections)

    def _to_response(
        self, day: NovenaDay, sections: List[NovenaDaySection]
    ) -> NovenaDayResponse:
        """Convert to response DTO."""
        return NovenaDayResponse(
            id=str(day.day_id),
            day_number=day.day_number,
            title=day.title,
            sections=[
                NovenaSectionResponse(
                    id=str(s.section_id),
                    section_type=s.section_type,
                    position=s.position,
                    content_md=s.content_md,
                )
                for s in sorted(sections, key=lambda x: x.position)
            ],
            created_at=day.created_at,
        )


class ListNovenaDaysUseCase:
    """List novena days use case."""

    def __init__(self, repository: NovenaRepository):
        self.repository = repository

    def execute(self, include_sections: bool = False) -> NovenaDayListResponse:
        """List all novena days."""
        days = self.repository.get_all_days()

        day_responses = []
        for day in days:
            sections = []
            if include_sections:
                raw_sections = self.repository.get_sections_by_day(day.day_id)
                sections = [
                    NovenaSectionResponse(
                        id=str(s.section_id),
                        section_type=s.section_type,
                        position=s.position,
                        content_md=s.content_md,
                    )
                    for s in sorted(raw_sections, key=lambda x: x.position)
                ]

            day_responses.append(
                NovenaDayResponse(
                    id=str(day.day_id),
                    day_number=day.day_number,
                    title=day.title,
                    sections=sections,
                    created_at=day.created_at,
                )
            )

        return NovenaDayListResponse(
            days=sorted(day_responses, key=lambda x: x.day_number),
            total=len(day_responses),
        )


class UpdateNovenaDayUseCase:
    """Update novena day use case."""

    def __init__(self, repository: NovenaRepository):
        self.repository = repository

    def execute(
        self, day_id: UUID, request: UpdateNovenaDayRequest
    ) -> NovenaDayResponse:
        """Update a novena day."""
        day = self.repository.get_day_by_id(day_id)
        if not day:
            raise NovenaDayNotFoundError(f"Day with ID {day_id} not found")

        if request.title is not None:
            day.title = request.title

        updated_day = self.repository.update_day(day)
        sections = self.repository.get_sections_by_day(updated_day.day_id)

        return NovenaDayResponse(
            id=str(updated_day.day_id),
            day_number=updated_day.day_number,
            title=updated_day.title,
            sections=[
                NovenaSectionResponse(
                    id=str(s.section_id),
                    section_type=s.section_type,
                    position=s.position,
                    content_md=s.content_md,
                )
                for s in sorted(sections, key=lambda x: x.position)
            ],
            created_at=updated_day.created_at,
        )


class DeleteNovenaDayUseCase:
    """Delete novena day use case."""

    def __init__(self, repository: NovenaRepository):
        self.repository = repository

    def execute(self, day_id: UUID) -> bool:
        """Delete a novena day."""
        day = self.repository.get_day_by_id(day_id)
        if not day:
            raise NovenaDayNotFoundError(f"Day with ID {day_id} not found")

        return self.repository.delete_day(day_id)
