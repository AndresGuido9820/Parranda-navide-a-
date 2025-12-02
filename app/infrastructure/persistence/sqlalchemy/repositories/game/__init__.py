"""Game repository implementations."""

from typing import List, Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.application.ports.repositories.game_repository import (
    AnoViejoRepositoryPort,
    GameStatsRepositoryPort,
)
from app.domain.entities.game import AnoViejoConfig, UserGameStats
from app.infrastructure.persistence.sqlalchemy.models.game import (
    AnoViejoConfig as AnoViejoORM,
)
from app.infrastructure.persistence.sqlalchemy.models.game import (
    UserGameStats as GameStatsORM,
)


class GameStatsRepository(GameStatsRepositoryPort):
    """SQLAlchemy implementation of game stats repository."""

    def __init__(self, db: Session):
        self.db = db

    def _to_domain(self, orm: GameStatsORM) -> UserGameStats:
        """Convert ORM model to domain entity."""
        return UserGameStats(
            id=orm.id,
            user_id=orm.user_id,
            game_type=orm.game_type,
            games_played=orm.games_played,
            games_won=orm.games_won,
            best_score=orm.best_score,
            total_score=orm.total_score,
            last_played_at=orm.last_played_at,
            created_at=orm.created_at,
            updated_at=orm.updated_at,
        )

    def get_by_user_and_game(
        self, user_id: UUID, game_type: str
    ) -> Optional[UserGameStats]:
        """Get game stats by user ID and game type."""
        orm = (
            self.db.query(GameStatsORM)
            .filter(GameStatsORM.user_id == user_id, GameStatsORM.game_type == game_type)
            .first()
        )
        return self._to_domain(orm) if orm else None

    def get_all_by_user(self, user_id: UUID) -> List[UserGameStats]:
        """Get all game stats for a user."""
        orms = (
            self.db.query(GameStatsORM).filter(GameStatsORM.user_id == user_id).all()
        )
        return [self._to_domain(o) for o in orms]

    def create(self, stats: UserGameStats) -> UserGameStats:
        """Create new game stats."""
        orm = GameStatsORM(
            id=stats.id,
            user_id=stats.user_id,
            game_type=stats.game_type,
            games_played=stats.games_played,
            games_won=stats.games_won,
            best_score=stats.best_score,
            total_score=stats.total_score,
            last_played_at=stats.last_played_at,
        )
        self.db.add(orm)
        self.db.commit()
        self.db.refresh(orm)
        return self._to_domain(orm)

    def update(self, stats: UserGameStats) -> UserGameStats:
        """Update existing game stats."""
        orm = self.db.query(GameStatsORM).filter(GameStatsORM.id == stats.id).first()

        if orm:
            orm.games_played = stats.games_played
            orm.games_won = stats.games_won
            orm.best_score = stats.best_score
            orm.total_score = stats.total_score
            orm.last_played_at = stats.last_played_at
            orm.updated_at = stats.updated_at

            self.db.commit()
            self.db.refresh(orm)
            return self._to_domain(orm)

        return stats


class AnoViejoRepository(AnoViejoRepositoryPort):
    """SQLAlchemy implementation of Año Viejo repository."""

    def __init__(self, db: Session):
        self.db = db

    def _to_domain(self, orm: AnoViejoORM) -> AnoViejoConfig:
        """Convert ORM model to domain entity."""
        return AnoViejoConfig(
            id=orm.id,
            user_id=orm.user_id,
            name=orm.name,
            config_json=orm.config_json,
            is_burned=orm.is_burned,
            burned_at=orm.burned_at,
            created_at=orm.created_at,
        )

    def create(self, config: AnoViejoConfig) -> AnoViejoConfig:
        """Create a new Año Viejo configuration."""
        orm = AnoViejoORM(
            id=config.id,
            user_id=config.user_id,
            name=config.name,
            config_json=config.config_json,
            is_burned=config.is_burned,
            burned_at=config.burned_at,
        )
        self.db.add(orm)
        self.db.commit()
        self.db.refresh(orm)
        return self._to_domain(orm)

    def get_by_id(self, config_id: UUID) -> Optional[AnoViejoConfig]:
        """Get Año Viejo by ID."""
        orm = self.db.query(AnoViejoORM).filter(AnoViejoORM.id == config_id).first()
        return self._to_domain(orm) if orm else None

    def get_all_by_user(
        self,
        user_id: UUID,
        page: int = 1,
        page_size: int = 10,
        include_burned: bool = True,
    ) -> tuple[List[AnoViejoConfig], int]:
        """Get all Año Viejo configs for a user."""
        query = self.db.query(AnoViejoORM).filter(AnoViejoORM.user_id == user_id)

        if not include_burned:
            query = query.filter(AnoViejoORM.is_burned == False)

        # Order by created_at descending
        query = query.order_by(AnoViejoORM.created_at.desc())

        # Get total
        total = query.count()

        # Apply pagination
        offset = (page - 1) * page_size
        orms = query.offset(offset).limit(page_size).all()

        return [self._to_domain(o) for o in orms], total

    def update(self, config: AnoViejoConfig) -> AnoViejoConfig:
        """Update an existing Año Viejo."""
        orm = self.db.query(AnoViejoORM).filter(AnoViejoORM.id == config.id).first()

        if orm:
            orm.name = config.name
            orm.config_json = config.config_json
            orm.is_burned = config.is_burned
            orm.burned_at = config.burned_at

            self.db.commit()
            self.db.refresh(orm)
            return self._to_domain(orm)

        return config

    def delete(self, config_id: UUID) -> bool:
        """Delete an Año Viejo by ID."""
        orm = self.db.query(AnoViejoORM).filter(AnoViejoORM.id == config_id).first()
        if orm:
            self.db.delete(orm)
            self.db.commit()
            return True
        return False

