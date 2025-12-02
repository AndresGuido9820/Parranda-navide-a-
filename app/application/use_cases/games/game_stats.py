"""Game stats use cases."""

from datetime import datetime, timezone
from typing import List
from uuid import UUID, uuid4

from app.application.dtos.games import (
    GameStatsListResponse,
    GameStatsResponse,
    UpdateGameStatsRequest,
)
from app.application.ports.repositories.game_repository import GameStatsRepositoryPort
from app.domain.entities.game import UserGameStats


class GetGameStatsUseCase:
    """Use case for getting game stats."""

    def __init__(self, repository: GameStatsRepositoryPort):
        self.repository = repository

    def execute(self, user_id: UUID) -> GameStatsListResponse:
        """Get all game stats for a user."""
        stats = self.repository.get_all_by_user(user_id)

        items = [
            GameStatsResponse(
                id=s.id,
                user_id=s.user_id,
                game_type=s.game_type,
                games_played=s.games_played,
                games_won=s.games_won,
                best_score=s.best_score,
                total_score=s.total_score,
                last_played_at=s.last_played_at,
                created_at=s.created_at,
                updated_at=s.updated_at,
            )
            for s in stats
        ]

        return GameStatsListResponse(items=items, total=len(items))

    def execute_by_game(self, user_id: UUID, game_type: str) -> GameStatsResponse:
        """Get stats for a specific game."""
        stats = self.repository.get_by_user_and_game(user_id, game_type)

        if not stats:
            # Return empty stats
            return GameStatsResponse(
                id=uuid4(),
                user_id=user_id,
                game_type=game_type,
                games_played=0,
                games_won=0,
                best_score=None,
                total_score=0,
                last_played_at=None,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )

        return GameStatsResponse(
            id=stats.id,
            user_id=stats.user_id,
            game_type=stats.game_type,
            games_played=stats.games_played,
            games_won=stats.games_won,
            best_score=stats.best_score,
            total_score=stats.total_score,
            last_played_at=stats.last_played_at,
            created_at=stats.created_at,
            updated_at=stats.updated_at,
        )


class UpdateGameStatsUseCase:
    """Use case for updating game stats after a game."""

    def __init__(self, repository: GameStatsRepositoryPort):
        self.repository = repository

    def execute(
        self, user_id: UUID, request: UpdateGameStatsRequest
    ) -> GameStatsResponse:
        """Update stats after a game is played."""
        now = datetime.now(timezone.utc)

        # Get existing stats or create new
        stats = self.repository.get_by_user_and_game(user_id, request.game_type)

        if stats:
            # Update existing stats
            stats.games_played += 1
            if request.won:
                stats.games_won += 1
            stats.total_score += request.score
            if stats.best_score is None or request.score > stats.best_score:
                stats.best_score = request.score
            stats.last_played_at = now
            stats.updated_at = now

            updated_stats = self.repository.update(stats)
        else:
            # Create new stats
            stats = UserGameStats(
                id=uuid4(),
                user_id=user_id,
                game_type=request.game_type,
                games_played=1,
                games_won=1 if request.won else 0,
                best_score=request.score,
                total_score=request.score,
                last_played_at=now,
                created_at=now,
                updated_at=now,
            )
            updated_stats = self.repository.create(stats)

        return GameStatsResponse(
            id=updated_stats.id,
            user_id=updated_stats.user_id,
            game_type=updated_stats.game_type,
            games_played=updated_stats.games_played,
            games_won=updated_stats.games_won,
            best_score=updated_stats.best_score,
            total_score=updated_stats.total_score,
            last_played_at=updated_stats.last_played_at,
            created_at=updated_stats.created_at,
            updated_at=updated_stats.updated_at,
        )

