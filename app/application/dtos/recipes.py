"""Recipe DTOs."""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field


class RecipeStepRequest(BaseModel):
    """Recipe step creation request."""

    instruction_md: str = Field(..., min_length=1, max_length=2000)
    ingredients_json: List[str] = Field(default_factory=list)
    time_minutes: Optional[int] = Field(None, ge=0)


class RecipeStepResponse(BaseModel):
    """Recipe step response."""

    id: str
    recipe_id: str
    step_number: int
    instruction_md: str
    ingredients_json: List[str]
    time_minutes: Optional[int] = None


class CreateRecipeRequest(BaseModel):
    """Recipe creation request."""

    title: str = Field(..., min_length=1, max_length=200)
    author_alias: Optional[str] = Field(None, max_length=100)
    photo_url: Optional[str] = Field(None, max_length=500)
    prep_time_minutes: Optional[int] = Field(None, ge=0)
    yield_amount: Optional[str] = Field(None, max_length=100)
    category: Optional[str] = Field(None, max_length=50)
    tags: List[str] = Field(default_factory=list)
    steps: List[RecipeStepRequest] = Field(default_factory=list)

    class Config:
        """Pydantic config."""

        json_schema_extra = {
            "example": {
                "title": "Buñuelos Navideños",
                "author_alias": "Chef María",
                "photo_url": "https://example.com/bunuelos.jpg",
                "prep_time_minutes": 45,
                "yield_amount": "12 unidades",
                "category": "postres",
                "tags": ["#postres", "#frito", "#tradicional"],
                "steps": [
                    {
                        "instruction_md": "Mezcla harina, polvo para hornear y sal.",
                        "ingredients_json": ["harina", "polvo para hornear", "sal"],
                        "time_minutes": 5,
                    }
                ],
            }
        }


class UpdateRecipeRequest(BaseModel):
    """Recipe update request."""

    title: Optional[str] = Field(None, min_length=1, max_length=200)
    author_alias: Optional[str] = Field(None, max_length=100)
    photo_url: Optional[str] = Field(None, max_length=500)
    prep_time_minutes: Optional[int] = Field(None, ge=0)
    yield_amount: Optional[str] = Field(None, max_length=100)
    category: Optional[str] = Field(None, max_length=50)
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None
    steps: Optional[List[RecipeStepRequest]] = None


class RecipeResponse(BaseModel):
    """Recipe response."""

    id: str
    title: str
    author_user_id: Optional[str] = None
    author_alias: Optional[str] = None
    photo_url: Optional[str] = None
    prep_time_minutes: Optional[int] = None
    yield_amount: Optional[str] = None
    category: Optional[str] = None
    rating: Optional[float] = None
    tags: List[str] = Field(default_factory=list)
    is_published: bool
    is_community: bool
    created_at: datetime
    updated_at: datetime
    steps: List[RecipeStepResponse] = Field(default_factory=list)


class RecipeListResponse(BaseModel):
    """Recipe list response with pagination."""

    items: List[RecipeResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class RecipeFilterParams(BaseModel):
    """Recipe filter parameters."""

    category: Optional[str] = None
    is_published: Optional[bool] = None
    is_community: Optional[bool] = None
    author_user_id: Optional[str] = None
    search: Optional[str] = None
    tags: Optional[List[str]] = None

