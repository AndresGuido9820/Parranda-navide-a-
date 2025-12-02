"""Game repository ports (interfaces)."""

from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from app.domain.entities.game import AnoViejoConfig, UserGameStats


class GameStatsRepositoryPort(ABC):
    """Abstract base class for game stats repository."""

    @abstractmethod
    def get_by_user_and_game(
        self, user_id: UUID, game_type: str
    ) -> Optional[UserGameStats]:
        """Get game stats by user ID and game type."""
        pass

    @abstractmethod
    def get_all_by_user(self, user_id: UUID) -> List[UserGameStats]:
        """Get all game stats for a user."""
        pass

    @abstractmethod
    def create(self, stats: UserGameStats) -> UserGameStats:
        """Create new game stats."""
        pass

    @abstractmethod
    def update(self, stats: UserGameStats) -> UserGameStats:
        """Update existing game stats."""
        pass


class AnoViejoRepositoryPort(ABC):
    """Abstract base class for Año Viejo repository."""

    @abstractmethod
    def create(self, config: AnoViejoConfig) -> AnoViejoConfig:
        """Create a new Año Viejo configuration."""
        pass

    @abstractmethod
    def get_by_id(self, config_id: UUID) -> Optional[AnoViejoConfig]:
        """Get Año Viejo by ID."""
        pass

    @abstractmethod
    def get_all_by_user(
        self,
        user_id: UUID,
        page: int = 1,
        page_size: int = 10,
        include_burned: bool = True,
    ) -> tuple[List[AnoViejoConfig], int]:
        """Get all Año Viejo configs for a user."""
        pass

    @abstractmethod
    def update(self, config: AnoViejoConfig) -> AnoViejoConfig:
        """Update an existing Año Viejo."""
        pass

    @abstractmethod
    def delete(self, config_id: UUID) -> bool:
        """Delete an Año Viejo by ID."""
        pass

