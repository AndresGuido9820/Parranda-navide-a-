"""Game domain entities."""

from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, Optional
from uuid import UUID


@dataclass
class UserGameStats:
    """User game statistics domain entity."""

    id: UUID
    user_id: UUID
    game_type: str
    games_played: int
    games_won: int
    best_score: Optional[int]
    total_score: int
    last_played_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime


@dataclass
class AnoViejoConfig:
    """Año Viejo doll configuration domain entity."""

    id: UUID
    user_id: UUID
    name: Optional[str]
    config_json: Dict[str, Any]
    is_burned: bool
    burned_at: Optional[datetime]
    created_at: datetime

