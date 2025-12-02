"""Novena sections use cases."""

from uuid import UUID

from app.application.dtos.novenas import (
    CreateNovenaSectionRequest,
    NovenaSectionResponse,
    UpdateNovenaSectionRequest,
)
from app.domain.entities.novena_day import NovenaDaySection
from app.infrastructure.persistence.sqlalchemy.repositories.novena import (
    NovenaRepository,
)


class NovenaSectionNotFoundError(Exception):
    """Raised when novena section is not found."""

    pass


class CreateNovenaSectionUseCase:
    """Create novena section use case."""

    def __init__(self, repository: NovenaRepository):
        self.repository = repository

    def execute(
        self, day_id: UUID, request: CreateNovenaSectionRequest
    ) -> NovenaSectionResponse:
        """Create a new section for a day."""
        # Verify day exists
        day = self.repository.get_day_by_id(day_id)
        if not day:
            raise ValueError(f"Day with ID {day_id} not found")

        section = NovenaDaySection(
            day_id=day_id,
            section_type=request.section_type,
            position=request.position,
            content_md=request.content_md,
        )

        created = self.repository.create_section(section)

        return NovenaSectionResponse(
            id=str(created.section_id),
            section_type=created.section_type,
            position=created.position,
            content_md=created.content_md,
        )


class UpdateNovenaSectionUseCase:
    """Update novena section use case."""

    def __init__(self, repository: NovenaRepository):
        self.repository = repository

    def execute(
        self, section_id: UUID, request: UpdateNovenaSectionRequest
    ) -> NovenaSectionResponse:
        """Update a section."""
        section = self.repository.get_section_by_id(section_id)
        if not section:
            raise NovenaSectionNotFoundError(f"Section with ID {section_id} not found")

        if request.section_type is not None:
            section.section_type = request.section_type
        if request.position is not None:
            section.position = request.position
        if request.content_md is not None:
            section.content_md = request.content_md

        updated = self.repository.update_section(section)

        return NovenaSectionResponse(
            id=str(updated.section_id),
            section_type=updated.section_type,
            position=updated.position,
            content_md=updated.content_md,
        )


class DeleteNovenaSectionUseCase:
    """Delete novena section use case."""

    def __init__(self, repository: NovenaRepository):
        self.repository = repository

    def execute(self, section_id: UUID) -> bool:
        """Delete a section."""
        section = self.repository.get_section_by_id(section_id)
        if not section:
            raise NovenaSectionNotFoundError(f"Section with ID {section_id} not found")

        return self.repository.delete_section(section_id)
