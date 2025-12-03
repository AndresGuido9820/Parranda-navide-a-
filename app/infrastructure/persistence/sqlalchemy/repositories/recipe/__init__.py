"""Recipe repository implementation."""

from decimal import Decimal
from typing import List, Optional, Tuple
from uuid import UUID

from sqlalchemy import func, select, or_
from sqlalchemy.orm import Session, selectinload

from app.domain.entities.recipe import Recipe as DomainRecipe
from app.domain.entities.recipe import RecipeStep as DomainRecipeStep

from ...models.recipe import Recipe as RecipeORM
from ...models.recipe import RecipeStep as RecipeStepORM
from ...models.recipe import UserFavoriteRecipe as UserFavoriteRecipeORM


class RecipeRepository:
    """Recipe repository implementation."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, recipe: DomainRecipe) -> DomainRecipe:
        """Create a new recipe with its steps."""
        recipe_orm = RecipeORM(
            id=recipe.recipe_id,
            title=recipe.title,
            author_user_id=recipe.author_user_id,
            author_alias=recipe.author_alias,
            photo_url=recipe.photo_url,
            prep_time_minutes=recipe.prep_time_minutes,
            yield_amount=recipe.yield_amount,
            category=recipe.category,
            rating=recipe.rating,
            tags=recipe.tags,
            is_published=recipe.is_published,
            is_community=recipe.is_community,
            created_at=recipe.created_at,
            updated_at=recipe.updated_at,
        )

        # Add steps
        for step in recipe.steps:
            step_orm = RecipeStepORM(
                id=step.step_id,
                recipe_id=recipe.recipe_id,
                step_number=step.step_number,
                instruction_md=step.instruction_md,
                ingredients_json=step.ingredients_json,
                time_minutes=step.time_minutes,
            )
            recipe_orm.steps.append(step_orm)

        self.db.add(recipe_orm)
        self.db.commit()
        self.db.refresh(recipe_orm)

        return self._to_domain(recipe_orm)

    def get_by_id(self, recipe_id: UUID) -> Optional[DomainRecipe]:
        """Get recipe by ID with steps."""
        stmt = (
            select(RecipeORM)
            .options(selectinload(RecipeORM.steps))
            .where(RecipeORM.id == recipe_id)
        )
        recipe_orm = self.db.execute(stmt).scalar_one_or_none()
        return self._to_domain(recipe_orm) if recipe_orm else None

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
    ) -> Tuple[List[DomainRecipe], int]:
        """Get all recipes with filters and pagination."""
        # Base query
        stmt = select(RecipeORM).options(selectinload(RecipeORM.steps))

        # Apply filters
        if category:
            stmt = stmt.where(RecipeORM.category == category)
        if is_published is not None:
            stmt = stmt.where(RecipeORM.is_published == is_published)
        if is_community is not None:
            stmt = stmt.where(RecipeORM.is_community == is_community)
        if author_user_id:
            stmt = stmt.where(RecipeORM.author_user_id == author_user_id)
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                or_(
                    RecipeORM.title.ilike(search_pattern),
                    RecipeORM.author_alias.ilike(search_pattern),
                )
            )
        if tags:
            stmt = stmt.where(RecipeORM.tags.overlap(tags))

        # Count total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = self.db.execute(count_stmt).scalar() or 0

        # Apply pagination and ordering
        offset = (page - 1) * page_size
        stmt = stmt.order_by(RecipeORM.created_at.desc()).offset(offset).limit(page_size)

        # Execute
        recipes_orm = self.db.execute(stmt).scalars().all()

        return [self._to_domain(r) for r in recipes_orm], total

    def get_by_user(
        self,
        user_id: UUID,
        page: int = 1,
        page_size: int = 10,
        category: Optional[str] = None,
        search: Optional[str] = None,
    ) -> Tuple[List[DomainRecipe], int]:
        """Get recipes by user ID."""
        return self.get_all(
            page=page,
            page_size=page_size,
            author_user_id=user_id,
            category=category,
            search=search,
        )

    def get_community_recipes(
        self,
        page: int = 1,
        page_size: int = 10,
        category: Optional[str] = None,
        search: Optional[str] = None,
    ) -> Tuple[List[DomainRecipe], int]:
        """Get community (published) recipes."""
        return self.get_all(
            page=page,
            page_size=page_size,
            is_published=True,
            category=category,
            search=search,
        )

    def update(self, recipe: DomainRecipe) -> DomainRecipe:
        """Update recipe and its steps."""
        stmt = (
            select(RecipeORM)
            .options(selectinload(RecipeORM.steps))
            .where(RecipeORM.id == recipe.recipe_id)
        )
        recipe_orm = self.db.execute(stmt).scalar_one()

        # Update recipe fields
        recipe_orm.title = recipe.title
        recipe_orm.author_alias = recipe.author_alias
        recipe_orm.photo_url = recipe.photo_url
        recipe_orm.prep_time_minutes = recipe.prep_time_minutes
        recipe_orm.yield_amount = recipe.yield_amount
        recipe_orm.category = recipe.category
        recipe_orm.rating = recipe.rating
        recipe_orm.tags = recipe.tags
        recipe_orm.is_published = recipe.is_published
        recipe_orm.updated_at = recipe.updated_at

        # Delete existing steps and recreate
        for step_orm in recipe_orm.steps:
            self.db.delete(step_orm)

        # Add new steps
        for step in recipe.steps:
            step_orm = RecipeStepORM(
                id=step.step_id,
                recipe_id=recipe.recipe_id,
                step_number=step.step_number,
                instruction_md=step.instruction_md,
                ingredients_json=step.ingredients_json,
                time_minutes=step.time_minutes,
            )
            recipe_orm.steps.append(step_orm)

        self.db.commit()
        self.db.refresh(recipe_orm)

        return self._to_domain(recipe_orm)

    def delete(self, recipe_id: UUID) -> bool:
        """Delete recipe by ID."""
        stmt = select(RecipeORM).where(RecipeORM.id == recipe_id)
        recipe_orm = self.db.execute(stmt).scalar_one_or_none()

        if recipe_orm:
            self.db.delete(recipe_orm)
            self.db.commit()
            return True

        return False

    def exists(self, recipe_id: UUID) -> bool:
        """Check if recipe exists."""
        stmt = select(func.count()).where(RecipeORM.id == recipe_id)
        count = self.db.execute(stmt).scalar() or 0
        return count > 0

    def _to_domain(self, recipe_orm: RecipeORM) -> DomainRecipe:
        """Convert ORM to domain entity."""
        steps = [
            DomainRecipeStep(
                step_id=step_orm.id,
                recipe_id=step_orm.recipe_id,
                step_number=step_orm.step_number,
                instruction_md=step_orm.instruction_md,
                ingredients_json=step_orm.ingredients_json or [],
                time_minutes=step_orm.time_minutes,
            )
            for step_orm in sorted(recipe_orm.steps, key=lambda s: s.step_number)
        ]

        return DomainRecipe(
            recipe_id=recipe_orm.id,
            title=recipe_orm.title,
            author_user_id=recipe_orm.author_user_id,
            author_alias=recipe_orm.author_alias,
            photo_url=recipe_orm.photo_url,
            prep_time_minutes=recipe_orm.prep_time_minutes,
            yield_amount=recipe_orm.yield_amount,
            category=recipe_orm.category,
            rating=Decimal(str(recipe_orm.rating)) if recipe_orm.rating else None,
            tags=recipe_orm.tags or [],
            is_published=recipe_orm.is_published,
            is_community=recipe_orm.is_community,
            created_at=recipe_orm.created_at,
            updated_at=recipe_orm.updated_at,
            steps=steps,
        )

    # === FAVORITES ===

    def add_favorite(self, user_id: UUID, recipe_id: UUID) -> bool:
        """Add recipe to user favorites."""
        existing = self.db.execute(
            select(UserFavoriteRecipeORM).where(
                UserFavoriteRecipeORM.user_id == user_id,
                UserFavoriteRecipeORM.recipe_id == recipe_id,
            )
        ).scalar_one_or_none()

        if existing:
            return False

        favorite = UserFavoriteRecipeORM(user_id=user_id, recipe_id=recipe_id)
        self.db.add(favorite)
        self.db.commit()
        return True

    def remove_favorite(self, user_id: UUID, recipe_id: UUID) -> bool:
        """Remove recipe from user favorites."""
        favorite = self.db.execute(
            select(UserFavoriteRecipeORM).where(
                UserFavoriteRecipeORM.user_id == user_id,
                UserFavoriteRecipeORM.recipe_id == recipe_id,
            )
        ).scalar_one_or_none()

        if not favorite:
            return False

        self.db.delete(favorite)
        self.db.commit()
        return True

    def is_favorite(self, user_id: UUID, recipe_id: UUID) -> bool:
        """Check if recipe is in user favorites."""
        stmt = select(func.count()).select_from(UserFavoriteRecipeORM).where(
            UserFavoriteRecipeORM.user_id == user_id,
            UserFavoriteRecipeORM.recipe_id == recipe_id,
        )
        count = self.db.execute(stmt).scalar() or 0
        return count > 0

    def get_user_favorites(
        self,
        user_id: UUID,
        page: int = 1,
        page_size: int = 10,
        category: Optional[str] = None,
        search: Optional[str] = None,
    ) -> Tuple[List[DomainRecipe], int]:
        """Get user favorite recipes."""
        stmt = (
            select(RecipeORM)
            .join(UserFavoriteRecipeORM)
            .options(selectinload(RecipeORM.steps))
            .where(UserFavoriteRecipeORM.user_id == user_id)
        )

        # Apply filters
        if category:
            stmt = stmt.where(RecipeORM.category == category)
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                or_(
                    RecipeORM.title.ilike(search_pattern),
                    RecipeORM.author_alias.ilike(search_pattern),
                )
            )

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = self.db.execute(count_stmt).scalar() or 0

        offset = (page - 1) * page_size
        stmt = stmt.order_by(UserFavoriteRecipeORM.created_at.desc()).offset(offset).limit(page_size)

        recipes_orm = self.db.execute(stmt).scalars().all()
        return [self._to_domain(r) for r in recipes_orm], total

    def get_user_favorite_ids(self, user_id: UUID) -> List[UUID]:
        """Get list of recipe IDs that user has favorited."""
        stmt = select(UserFavoriteRecipeORM.recipe_id).where(
            UserFavoriteRecipeORM.user_id == user_id
        )
        result = self.db.execute(stmt).scalars().all()
        return list(result)

