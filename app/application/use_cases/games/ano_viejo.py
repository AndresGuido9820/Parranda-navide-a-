"""Año Viejo use cases."""

import math
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID, uuid4

from app.application.dtos.games import (
    AnoViejoListResponse,
    AnoViejoResponse,
    CreateAnoViejoRequest,
    UpdateAnoViejoRequest,
)
from app.application.ports.repositories.game_repository import AnoViejoRepositoryPort
from app.domain.entities.game import AnoViejoConfig


class AnoViejoNotFoundError(Exception):
    """Raised when Año Viejo is not found."""

    pass


class CreateAnoViejoUseCase:
    """Use case for creating a new Año Viejo."""

    def __init__(self, repository: AnoViejoRepositoryPort):
        self.repository = repository

    def execute(self, user_id: UUID, request: CreateAnoViejoRequest) -> AnoViejoResponse:
        """Execute the use case."""
        config = AnoViejoConfig(
            id=uuid4(),
            user_id=user_id,
            name=request.name,
            config_json=request.config_json,
            is_burned=False,
            burned_at=None,
            created_at=datetime.now(timezone.utc),
        )

        created = self.repository.create(config)

        return AnoViejoResponse(
            id=created.id,
            user_id=created.user_id,
            name=created.name,
            config_json=created.config_json,
            is_burned=created.is_burned,
            burned_at=created.burned_at,
            created_at=created.created_at,
        )


class GetAnoViejoUseCase:
    """Use case for getting an Año Viejo by ID."""

    def __init__(self, repository: AnoViejoRepositoryPort):
        self.repository = repository

    def execute(self, config_id: UUID) -> AnoViejoResponse:
        """Execute the use case."""
        config = self.repository.get_by_id(config_id)

        if not config:
            raise AnoViejoNotFoundError(f"Año Viejo with ID {config_id} not found")

        return AnoViejoResponse(
            id=config.id,
            user_id=config.user_id,
            name=config.name,
            config_json=config.config_json,
            is_burned=config.is_burned,
            burned_at=config.burned_at,
            created_at=config.created_at,
        )


class ListAnoViejoUseCase:
    """Use case for listing Año Viejo configs."""

    def __init__(self, repository: AnoViejoRepositoryPort):
        self.repository = repository

    def execute(
        self,
        user_id: UUID,
        page: int = 1,
        page_size: int = 10,
        include_burned: bool = True,
    ) -> AnoViejoListResponse:
        """Execute the use case."""
        configs, total = self.repository.get_all_by_user(
            user_id=user_id,
            page=page,
            page_size=page_size,
            include_burned=include_burned,
        )

        items = [
            AnoViejoResponse(
                id=c.id,
                user_id=c.user_id,
                name=c.name,
                config_json=c.config_json,
                is_burned=c.is_burned,
                burned_at=c.burned_at,
                created_at=c.created_at,
            )
            for c in configs
        ]

        total_pages = max(1, math.ceil(total / page_size))

        return AnoViejoListResponse(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )


class UpdateAnoViejoUseCase:
    """Use case for updating an Año Viejo."""

    def __init__(self, repository: AnoViejoRepositoryPort):
        self.repository = repository

    def execute(
        self, config_id: UUID, user_id: UUID, request: UpdateAnoViejoRequest
    ) -> AnoViejoResponse:
        """Execute the use case."""
        config = self.repository.get_by_id(config_id)

        if not config:
            raise AnoViejoNotFoundError(f"Año Viejo with ID {config_id} not found")

        # Check ownership
        if config.user_id != user_id:
            raise PermissionError("You don't have permission to update this Año Viejo")

        # Can't update burned configs
        if config.is_burned:
            raise ValueError("Cannot update a burned Año Viejo")

        # Update fields
        if request.name is not None:
            config.name = request.name
        if request.config_json is not None:
            config.config_json = request.config_json

        updated = self.repository.update(config)

        return AnoViejoResponse(
            id=updated.id,
            user_id=updated.user_id,
            name=updated.name,
            config_json=updated.config_json,
            is_burned=updated.is_burned,
            burned_at=updated.burned_at,
            created_at=updated.created_at,
        )


class BurnAnoViejoUseCase:
    """Use case for burning an Año Viejo."""

    def __init__(self, repository: AnoViejoRepositoryPort):
        self.repository = repository

    def execute(self, config_id: UUID, user_id: UUID) -> AnoViejoResponse:
        """Execute the use case - burn the Año Viejo!"""
        config = self.repository.get_by_id(config_id)

        if not config:
            raise AnoViejoNotFoundError(f"Año Viejo with ID {config_id} not found")

        # Check ownership
        if config.user_id != user_id:
            raise PermissionError("You don't have permission to burn this Año Viejo")

        # Already burned?
        if config.is_burned:
            raise ValueError("This Año Viejo has already been burned")

        # Burn it! 🔥
        config.is_burned = True
        config.burned_at = datetime.now(timezone.utc)

        burned = self.repository.update(config)

        return AnoViejoResponse(
            id=burned.id,
            user_id=burned.user_id,
            name=burned.name,
            config_json=burned.config_json,
            is_burned=burned.is_burned,
            burned_at=burned.burned_at,
            created_at=burned.created_at,
        )


class DeleteAnoViejoUseCase:
    """Use case for deleting an Año Viejo."""

    def __init__(self, repository: AnoViejoRepositoryPort):
        self.repository = repository

    def execute(self, config_id: UUID, user_id: UUID) -> bool:
        """Execute the use case."""
        config = self.repository.get_by_id(config_id)

        if not config:
            raise AnoViejoNotFoundError(f"Año Viejo with ID {config_id} not found")

        # Check ownership
        if config.user_id != user_id:
            raise PermissionError("You don't have permission to delete this Año Viejo")

        return self.repository.delete(config_id)

