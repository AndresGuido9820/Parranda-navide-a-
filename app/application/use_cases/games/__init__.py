"""Game use cases."""

from app.application.use_cases.games.ano_viejo import (
    AnoViejoNotFoundError,
    BurnAnoViejoUseCase,
    CreateAnoViejoUseCase,
    DeleteAnoViejoUseCase,
    GetAnoViejoUseCase,
    ListAnoViejoUseCase,
    UpdateAnoViejoUseCase,
)
from app.application.use_cases.games.game_stats import (
    GetGameStatsUseCase,
    UpdateGameStatsUseCase,
)

__all__ = [
    # Game Stats
    "GetGameStatsUseCase",
    "UpdateGameStatsUseCase",
    # Año Viejo
    "CreateAnoViejoUseCase",
    "GetAnoViejoUseCase",
    "ListAnoViejoUseCase",
    "UpdateAnoViejoUseCase",
    "BurnAnoViejoUseCase",
    "DeleteAnoViejoUseCase",
    "AnoViejoNotFoundError",
]

