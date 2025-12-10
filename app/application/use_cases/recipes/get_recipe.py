"""Get recipe use case."""

from uuid import UUID

from app.application.dtos.recipes import RecipeResponse, RecipeStepResponse
from app.application.ports.repositories.recipe_repository import RecipeRepository
from app.domain.entities.recipe import Recipe


class RecipeNotFoundError(Exception):
    """Recipe not found error."""

    pass


class GetRecipeUseCase:
    """Get recipe by ID use case."""

    def __init__(self, recipe_repository: RecipeRepository):
        self.recipe_repository = recipe_repository

    def execute(self, recipe_id: UUID) -> RecipeResponse:
        """Execute get recipe by ID."""
        recipe = self.recipe_repository.get_by_id(recipe_id)

        if not recipe:
            raise RecipeNotFoundError(f"Recipe with ID {recipe_id} not found")

        return self._to_response(recipe)

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

