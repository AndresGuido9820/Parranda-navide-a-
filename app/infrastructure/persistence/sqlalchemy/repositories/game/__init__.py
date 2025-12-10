"""Game repository implementations using Supabase."""

from typing import List, Optional
from uuid import UUID

from supabase import Client

from app.application.ports.repositories.game_repository import (
    AnoViejoRepositoryPort,
    GameStatsRepositoryPort,
)
from app.domain.entities.game import AnoViejoConfig, UserGameStats
from app.infrastructure.persistence.sqlalchemy.supabase_helpers import (
    datetime_to_iso,
    page_range,
    table,
    to_datetime,
    to_uuid,
)


class GameStatsRepository(GameStatsRepositoryPort):
    """Supabase implementation of game stats repository."""

    def __init__(self, client: Client):
        self.client = client

    def get_by_user_and_game(
        self, user_id: UUID, game_type: str
    ) -> Optional[UserGameStats]:
        """Get game stats by user ID and game type."""
        response = (
            table(self.client, "user_game_stats")
            .select("*")
            .eq("user_id", str(user_id))
            .eq("game_type", game_type)
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return self._to_domain(response.data[0])

    def get_all_by_user(self, user_id: UUID) -> List[UserGameStats]:
        """Get all game stats for a user."""
        response = (
            table(self.client, "user_game_stats")
            .select("*")
            .eq("user_id", str(user_id))
            .order("created_at", desc=True)
            .execute()
        )
        return [self._to_domain(item) for item in response.data or []]

    def create(self, stats: UserGameStats) -> UserGameStats:
        """Create new game stats."""
        payload = {
            "id": str(stats.id),
            "user_id": str(stats.user_id),
            "game_type": stats.game_type,
            "games_played": stats.games_played,
            "games_won": stats.games_won,
            "best_score": stats.best_score,
            "total_score": stats.total_score,
            "last_played_at": datetime_to_iso(stats.last_played_at),
            "created_at": datetime_to_iso(stats.created_at),
            "updated_at": datetime_to_iso(stats.updated_at),
        }
        response = table(self.client, "user_game_stats").insert(payload).execute()
        record = response.data[0] if response.data else payload
        return self._to_domain(record)

    def update(self, stats: UserGameStats) -> UserGameStats:
        """Update existing game stats."""
        payload = {
            "games_played": stats.games_played,
            "games_won": stats.games_won,
            "best_score": stats.best_score,
            "total_score": stats.total_score,
            "last_played_at": datetime_to_iso(stats.last_played_at),
            "updated_at": datetime_to_iso(stats.updated_at),
        }
        table(self.client, "user_game_stats").update(payload).eq(
            "id", str(stats.id)
        ).execute()

        updated = self.get_by_user_and_game(stats.user_id, stats.game_type)
        return updated or stats

    def _to_domain(self, record) -> UserGameStats:
        """Convert Supabase record to domain entity."""
        return UserGameStats(
            id=to_uuid(record.get("id")),
            user_id=to_uuid(record.get("user_id")),
            game_type=record.get("game_type"),
            games_played=record.get("games_played") or 0,
            games_won=record.get("games_won") or 0,
            best_score=record.get("best_score"),
            total_score=record.get("total_score") or 0,
            last_played_at=to_datetime(record.get("last_played_at")),
            created_at=to_datetime(record.get("created_at")),
            updated_at=to_datetime(record.get("updated_at")),
        )


class AnoViejoRepository(AnoViejoRepositoryPort):
    """Supabase implementation of Año Viejo repository."""

    def __init__(self, client: Client):
        self.client = client

    def create(self, config: AnoViejoConfig) -> AnoViejoConfig:
        """Create a new Año Viejo configuration."""
        payload = {
            "id": str(config.id),
            "user_id": str(config.user_id),
            "name": config.name,
            "config_json": config.config_json,
            "is_burned": config.is_burned,
            "burned_at": datetime_to_iso(config.burned_at),
            "created_at": datetime_to_iso(config.created_at),
        }
        response = table(self.client, "ano_viejo_configs").insert(payload).execute()
        record = response.data[0] if response.data else payload
        return self._to_domain(record)

    def get_by_id(self, config_id: UUID) -> Optional[AnoViejoConfig]:
        """Get Año Viejo by ID."""
        response = (
            table(self.client, "ano_viejo_configs")
            .select("*")
            .eq("id", str(config_id))
            .limit(1)
            .execute()
        )
        if not response.data:
            return None
        return self._to_domain(response.data[0])

    def get_all_by_user(
        self,
        user_id: UUID,
        page: int = 1,
        page_size: int = 10,
        include_burned: bool = True,
    ) -> tuple[List[AnoViejoConfig], int]:
        """Get all Año Viejo configs for a user."""
        query = (
            table(self.client, "ano_viejo_configs")
            .select("*", count="exact")
            .eq("user_id", str(user_id))
        )

        if not include_burned:
            query = query.eq("is_burned", False)

        start, end = page_range(page, page_size)
        response = query.order("created_at", desc=True).range(start, end).execute()

        records = response.data or []
        total = response.count or 0

        return [self._to_domain(r) for r in records], total

    def update(self, config: AnoViejoConfig) -> AnoViejoConfig:
        """Update an existing Año Viejo."""
        payload = {
            "name": config.name,
            "config_json": config.config_json,
            "is_burned": config.is_burned,
            "burned_at": datetime_to_iso(config.burned_at),
        }
        table(self.client, "ano_viejo_configs").update(payload).eq(
            "id", str(config.id)
        ).execute()

        updated = self.get_by_id(config.id)
        return updated or config

    def delete(self, config_id: UUID) -> bool:
        """Delete an Año Viejo by ID."""
        response = (
            table(self.client, "ano_viejo_configs")
            .delete()
            .eq("id", str(config_id))
            .execute()
        )
        return bool(response.data)

    def _to_domain(self, record) -> AnoViejoConfig:
        """Convert Supabase record to domain entity."""
        return AnoViejoConfig(
            id=to_uuid(record.get("id")),
            user_id=to_uuid(record.get("user_id")),
            name=record.get("name"),
            config_json=record.get("config_json") or {},
            is_burned=bool(record.get("is_burned", False)),
            burned_at=to_datetime(record.get("burned_at")),
            created_at=to_datetime(record.get("created_at")),
        )
