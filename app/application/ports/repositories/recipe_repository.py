"""Recipe repository port."""

from abc import ABC, abstractmethod
from typing import List, Optional, Tuple
from uuid import UUID

from app.domain.entities.recipe import Recipe


class RecipeRepository(ABC):
    """Recipe repository interface."""

    @abstractmethod
    def create(self, recipe: Recipe) -> Recipe:
        """Create a new recipe with its steps."""
        pass

    @abstractmethod
    def get_by_id(self, recipe_id: UUID) -> Optional[Recipe]:
        """Get recipe by ID with steps."""
        pass

    @abstractmethod
    def get_all(
        self,
        page: int = 1,
        page_size: int = 10,
        category: Optional[str] = None,
        is_published: Optional[bool] = None,
        is_community: Optional[bool] = None,
        author_user_id: Optional[UUID] = None,
        search: Optional[str] = None,
        tags: Optional[List[str]] = None,
    ) -> Tuple[List[Recipe], int]:
        """
        Get all recipes with filters and pagination.
        
        Returns:
            Tuple of (recipes list, total count)
        """
        pass

    @abstractmethod
    def get_by_user(
        self,
        user_id: UUID,
        page: int = 1,
        page_size: int = 10,
    ) -> Tuple[List[Recipe], int]:
        """Get recipes by user ID."""
        pass

    @abstractmethod
    def get_community_recipes(
        self,
        page: int = 1,
        page_size: int = 10,
        category: Optional[str] = None,
    ) -> Tuple[List[Recipe], int]:
        """Get community (published) recipes."""
        pass

    @abstractmethod
    def update(self, recipe: Recipe) -> Recipe:
        """Update recipe and its steps."""
        pass

    @abstractmethod
    def delete(self, recipe_id: UUID) -> bool:
        """Delete recipe by ID."""
        pass

    @abstractmethod
    def exists(self, recipe_id: UUID) -> bool:
        """Check if recipe exists."""
        pass

