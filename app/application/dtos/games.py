"""Game DTOs."""

from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


# === Game Stats DTOs ===


class GameStatsResponse(BaseModel):
    """DTO for game stats response."""

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

    class Config:
        from_attributes = True


class UpdateGameStatsRequest(BaseModel):
    """DTO for updating game stats after a game."""

    game_type: str = Field(..., example="nino_jesus")
    won: bool = Field(..., example=True)
    score: int = Field(..., ge=0, example=100)


class GameStatsListResponse(BaseModel):
    """DTO for list of game stats."""

    items: List[GameStatsResponse]
    total: int


# === Año Viejo DTOs ===


class CreateAnoViejoRequest(BaseModel):
    """DTO for creating an Año Viejo configuration."""

    name: Optional[str] = Field(None, max_length=100, example="Mi Año Viejo 2025")
    config_json: Dict[str, Any] = Field(
        ...,
        example={
            "sombrero": {"id": "gorro-papa-noel", "color": "#DC2626"},
            "camisa": {"id": "roja", "color": "#DC2626"},
            "pantalones": {"id": "azules", "color": "#1E40AF"},
            "zapatos": {"id": "negros", "color": "#1a1a1a"},
            "accesorios": {"id": "lentes", "color": "#000000"},
        },
    )

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Mi Año Viejo 2025",
                "config_json": {
                    "sombrero": {"id": "gorro-papa-noel", "color": "#DC2626"},
                    "camisa": {"id": "roja", "color": "#DC2626"},
                    "pantalones": {"id": "azules", "color": "#1E40AF"},
                    "zapatos": {"id": "negros", "color": "#1a1a1a"},
                    "accesorios": {"id": "lentes", "color": "#000000"},
                },
            }
        }


class UpdateAnoViejoRequest(BaseModel):
    """DTO for updating an Año Viejo configuration."""

    name: Optional[str] = Field(None, max_length=100)
    config_json: Optional[Dict[str, Any]] = None


class BurnAnoViejoRequest(BaseModel):
    """DTO for burning an Año Viejo."""

    pass  # No parameters needed, just the action


class AnoViejoResponse(BaseModel):
    """DTO for Año Viejo response."""

    id: UUID
    user_id: UUID
    name: Optional[str]
    config_json: Dict[str, Any]
    is_burned: bool
    burned_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class AnoViejoListResponse(BaseModel):
    """DTO for paginated Año Viejo list."""

    items: List[AnoViejoResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

