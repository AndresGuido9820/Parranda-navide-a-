"""Recipe domain entities."""

from dataclasses import dataclass, field
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID, uuid4


@dataclass
class RecipeStep:
    """Recipe step domain entity."""

    instruction_md: str
    ingredients_json: List[str] = field(default_factory=list)
    time_minutes: Optional[int] = None
    step_id: Optional[UUID] = field(default_factory=uuid4)
    recipe_id: Optional[UUID] = None
    step_number: int = 1

    def __str__(self) -> str:
        return f"RecipeStep(step_number={self.step_number})"


@dataclass
class Recipe:
    """Recipe domain entity."""

    title: str
    author_user_id: Optional[UUID] = None
    author_alias: Optional[str] = None
    photo_url: Optional[str] = None
    prep_time_minutes: Optional[int] = None
    yield_amount: Optional[str] = None
    category: Optional[str] = None
    rating: Optional[Decimal] = None
    tags: List[str] = field(default_factory=list)
    is_published: bool = False
    is_community: bool = False
    steps: List[RecipeStep] = field(default_factory=list)
    recipe_id: Optional[UUID] = field(default_factory=uuid4)
    created_at: Optional[datetime] = field(default_factory=datetime.now)
    updated_at: Optional[datetime] = field(default_factory=datetime.now)

    def __str__(self) -> str:
        return f"Recipe(id={self.recipe_id}, title={self.title})"

    def __repr__(self) -> str:
        return self.__str__()

    @classmethod
    def create(
        cls,
        title: str,
        author_user_id: Optional[UUID] = None,
        author_alias: Optional[str] = None,
        photo_url: Optional[str] = None,
        prep_time_minutes: Optional[int] = None,
        yield_amount: Optional[str] = None,
        category: Optional[str] = None,
        tags: Optional[List[str]] = None,
        is_published: bool = False,
        is_community: bool = False,
        steps: Optional[List[RecipeStep]] = None,
    ) -> "Recipe":
        """Create a new recipe instance."""
        return cls(
            title=title,
            author_user_id=author_user_id,
            author_alias=author_alias,
            photo_url=photo_url,
            prep_time_minutes=prep_time_minutes,
            yield_amount=yield_amount,
            category=category,
            tags=tags or [],
            is_published=is_published,
            is_community=is_community,
            steps=steps or [],
        )

    def add_step(self, step: RecipeStep) -> None:
        """Add a step to the recipe."""
        step.recipe_id = self.recipe_id
        step.step_number = len(self.steps) + 1
        self.steps.append(step)

    def update_rating(self, new_rating: Decimal) -> None:
        """Update recipe rating."""
        self.rating = new_rating
        self.updated_at = datetime.now()

    def publish(self) -> None:
        """Publish the recipe."""
        self.is_published = True
        self.updated_at = datetime.now()

    def unpublish(self) -> None:
        """Unpublish the recipe."""
        self.is_published = False
        self.updated_at = datetime.now()

