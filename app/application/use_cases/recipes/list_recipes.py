"""List recipes use case."""

import math
from typing import List, Optional
from uuid import UUID

from app.application.dtos.recipes import (
    RecipeListResponse,
    RecipeResponse,
    RecipeStepResponse,
)
from app.application.ports.repositories.recipe_repository import RecipeRepository
from app.domain.entities.recipe import Recipe


class ListRecipesUseCase:
    """List recipes with filters and pagination."""

    def __init__(self, recipe_repository: RecipeRepository):
        self.recipe_repository = recipe_repository

    def execute(
        self,
        page: int = 1,
        page_size: int = 10,
        category: Optional[str] = None,
        is_published: Optional[bool] = None,
        is_community: Optional[bool] = None,
        author_user_id: Optional[UUID] = None,
        search: Optional[str] = None,
        tags: Optional[List[str]] = None,
    ) -> RecipeListResponse:
        """Execute list recipes."""
        recipes, total = self.recipe_repository.get_all(
            page=page,
            page_size=page_size,
            category=category,
            is_published=is_published,
            is_community=is_community,
            author_user_id=author_user_id,
            search=search,
            tags=tags,
        )

        total_pages = math.ceil(total / page_size) if total > 0 else 1

        return RecipeListResponse(
            items=[self._to_response(recipe) for recipe in recipes],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    def execute_my_recipes(
        self,
        user_id: UUID,
        page: int = 1,
        page_size: int = 10,
    ) -> RecipeListResponse:
        """Get recipes for a specific user."""
        recipes, total = self.recipe_repository.get_by_user(
            user_id=user_id,
            page=page,
            page_size=page_size,
        )

        total_pages = math.ceil(total / page_size) if total > 0 else 1

        return RecipeListResponse(
            items=[self._to_response(recipe) for recipe in recipes],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    def execute_community(
        self,
        page: int = 1,
        page_size: int = 10,
        category: Optional[str] = None,
    ) -> RecipeListResponse:
        """Get community recipes."""
        recipes, total = self.recipe_repository.get_community_recipes(
            page=page,
            page_size=page_size,
            category=category,
        )

        total_pages = math.ceil(total / page_size) if total > 0 else 1

        return RecipeListResponse(
            items=[self._to_response(recipe) for recipe in recipes],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    def _to_response(self, recipe: Recipe) -> RecipeResponse:
        """Convert domain entity to response."""
        return RecipeResponse(
            id=str(recipe.recipe_id),
            title=recipe.title,
            author_user_id=str(recipe.author_user_id) if recipe.author_user_id else None,
            author_alias=recipe.author_alias,
            photo_url=recipe.photo_url,
            prep_time_minutes=recipe.prep_time_minutes,
            yield_amount=recipe.yield_amount,
            category=recipe.category,
            rating=float(recipe.rating) if recipe.rating else None,
            tags=recipe.tags,
            is_published=recipe.is_published,
            is_community=recipe.is_community,
            created_at=recipe.created_at,
            updated_at=recipe.updated_at,
            steps=[
                RecipeStepResponse(
                    id=str(step.step_id),
                    recipe_id=str(step.recipe_id),
                    step_number=step.step_number,
                    instruction_md=step.instruction_md,
                    ingredients_json=step.ingredients_json,
                    time_minutes=step.time_minutes,
                )
                for step in recipe.steps
            ],
        )

