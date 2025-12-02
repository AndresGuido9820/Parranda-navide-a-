"""Update recipe use case."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from app.application.dtos.recipes import (
    RecipeResponse,
    RecipeStepResponse,
    UpdateRecipeRequest,
)
from app.application.ports.repositories.recipe_repository import RecipeRepository
from app.application.use_cases.recipes.get_recipe import RecipeNotFoundError
from app.domain.entities.recipe import Recipe, RecipeStep


class UpdateRecipeUseCase:
    """Update recipe use case."""

    def __init__(self, recipe_repository: RecipeRepository):
        self.recipe_repository = recipe_repository

    def execute(
        self,
        recipe_id: UUID,
        request: UpdateRecipeRequest,
        user_id: Optional[UUID] = None,
    ) -> RecipeResponse:
        """Execute recipe update."""
        # Get existing recipe
        recipe = self.recipe_repository.get_by_id(recipe_id)
        if not recipe:
            raise RecipeNotFoundError(f"Recipe with ID {recipe_id} not found")

        # Check ownership if user_id provided
        if user_id and recipe.author_user_id and recipe.author_user_id != user_id:
            raise PermissionError("You don't have permission to update this recipe")

        # Update fields
        if request.title is not None:
            recipe.title = request.title
        if request.author_alias is not None:
            recipe.author_alias = request.author_alias
        if request.photo_url is not None:
            recipe.photo_url = request.photo_url
        if request.prep_time_minutes is not None:
            recipe.prep_time_minutes = request.prep_time_minutes
        if request.yield_amount is not None:
            recipe.yield_amount = request.yield_amount
        if request.category is not None:
            recipe.category = request.category
        if request.tags is not None:
            recipe.tags = request.tags
        if request.is_published is not None:
            recipe.is_published = request.is_published

        # Update steps if provided
        if request.steps is not None:
            recipe.steps = []
            for step_request in request.steps:
                step = RecipeStep(
                    instruction_md=step_request.instruction_md,
                    ingredients_json=step_request.ingredients_json,
                    time_minutes=step_request.time_minutes,
                )
                recipe.add_step(step)

        recipe.updated_at = datetime.now()

        # Save updated recipe
        updated_recipe = self.recipe_repository.update(recipe)

        return self._to_response(updated_recipe)

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

