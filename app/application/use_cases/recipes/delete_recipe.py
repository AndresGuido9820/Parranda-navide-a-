"""Delete recipe use case."""

from typing import Optional
from uuid import UUID

from app.application.ports.repositories.recipe_repository import RecipeRepository
from app.application.use_cases.recipes.get_recipe import RecipeNotFoundError


class DeleteRecipeUseCase:
    """Delete recipe use case."""

    def __init__(self, recipe_repository: RecipeRepository):
        self.recipe_repository = recipe_repository

    def execute(
        self,
        recipe_id: UUID,
        user_id: Optional[UUID] = None,
    ) -> bool:
        """Execute recipe deletion."""
        # Get existing recipe to check ownership
        recipe = self.recipe_repository.get_by_id(recipe_id)
        if not recipe:
            raise RecipeNotFoundError(f"Recipe with ID {recipe_id} not found")

        # Check ownership if user_id provided
        if user_id and recipe.author_user_id and recipe.author_user_id != user_id:
            raise PermissionError("You don't have permission to delete this recipe")

        # Delete recipe
        return self.recipe_repository.delete(recipe_id)

