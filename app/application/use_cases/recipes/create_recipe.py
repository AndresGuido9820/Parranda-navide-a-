"""Create recipe use case."""

from typing import Optional
from uuid import UUID

from app.application.dtos.recipes import (
    CreateRecipeRequest,
    RecipeResponse,
    RecipeStepResponse,
)
from app.application.ports.repositories.recipe_repository import RecipeRepository
from app.domain.entities.recipe import Recipe, RecipeStep


class CreateRecipeUseCase:
    """Create new recipe use case."""

    def __init__(self, recipe_repository: RecipeRepository):
        self.recipe_repository = recipe_repository

    def execute(
        self,
        request: CreateRecipeRequest,
        user_id: Optional[UUID] = None,
    ) -> RecipeResponse:
        """Execute recipe creation."""
        # Create domain recipe
        recipe = Recipe.create(
            title=request.title,
            author_user_id=user_id,
            author_alias=request.author_alias,
            photo_url=request.photo_url,
            prep_time_minutes=request.prep_time_minutes,
            yield_amount=request.yield_amount,
            category=request.category,
            tags=request.tags,
            is_published=True,
            is_community=user_id is None,
        )

        # Add steps
        for step_request in request.steps:
            step = RecipeStep(
                instruction_md=step_request.instruction_md,
                ingredients_json=step_request.ingredients_json,
                time_minutes=step_request.time_minutes,
            )
            recipe.add_step(step)

        # Save recipe
        saved_recipe = self.recipe_repository.create(recipe)

        # Return response
        return self._to_response(saved_recipe)

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

