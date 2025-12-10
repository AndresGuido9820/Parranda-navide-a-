"""Recipe repository implementation using Supabase."""

from datetime import datetime, timezone
from decimal import Decimal
from typing import Any, Dict, List, Optional, Tuple
from uuid import UUID

from supabase import Client

from app.domain.entities.recipe import Recipe as DomainRecipe
from app.domain.entities.recipe import RecipeStep as DomainRecipeStep
from app.infrastructure.persistence.sqlalchemy.supabase_helpers import (
    datetime_to_iso,
    page_range,
    table,
    to_datetime,
    to_uuid,
)


class RecipeRepository:
    """Supabase-backed recipe repository."""

    def __init__(self, client: Client):
        self.client = client

    def create(self, recipe: DomainRecipe) -> DomainRecipe:
        """Create a new recipe with its steps."""
        now = datetime.now(timezone.utc)
        recipe_data = {
            "id": str(recipe.recipe_id),
            "title": recipe.title,
            "author_user_id": str(recipe.author_user_id)
            if recipe.author_user_id
            else None,
            "author_alias": recipe.author_alias,
            "photo_url": recipe.photo_url,
            "prep_time_minutes": recipe.prep_time_minutes,
            "yield": recipe.yield_amount,
            "category": recipe.category,
            "rating": float(recipe.rating) if recipe.rating is not None else None,
            "tags": recipe.tags or [],
            "is_published": recipe.is_published,
            "is_community": recipe.is_community,
            "created_at": datetime_to_iso(recipe.created_at or now),
            "updated_at": datetime_to_iso(recipe.updated_at or now),
        }

        table(self.client, "recipes").insert(recipe_data).execute()

        if recipe.steps:
            steps_payload = [
                {
                    "id": str(step.step_id),
                    "recipe_id": str(recipe.recipe_id),
                    "step_number": step.step_number,
                    "instruction_md": step.instruction_md,
                    "ingredients_json": step.ingredients_json,
                    "time_minutes": step.time_minutes,
                }
                for step in recipe.steps
            ]
            table(self.client, "recipe_steps").insert(steps_payload).execute()

        created = self.get_by_id(recipe.recipe_id)
        return created or recipe

    def get_by_id(self, recipe_id: UUID) -> Optional[DomainRecipe]:
        """Get recipe by ID with steps."""
        response = (
            table(self.client, "recipes")
            .select("*")
            .eq("id", str(recipe_id))
            .limit(1)
            .execute()
        )
        if not response.data:
            return None

        record = response.data[0]
        steps_map = self._fetch_steps([record["id"]])
        return self._to_domain(record, steps_map.get(str(record["id"]), []))

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
        query = table(self.client, "recipes").select("*", count="exact")

        if category:
            query = query.eq("category", category)
        if is_published is not None:
            query = query.eq("is_published", is_published)
        if is_community is not None:
            query = query.eq("is_community", is_community)
        if author_user_id:
            query = query.eq("author_user_id", str(author_user_id))
        if search:
            like = f"%{search}%"
            query = query.or_(f"title.ilike.{like},author_alias.ilike.{like}")
        if tags:
            query = query.overlaps("tags", tags)

        start, end = page_range(page, page_size)
        response = query.order("created_at", desc=True).range(start, end).execute()

        records: List[Dict[str, Any]] = response.data or []
        total = response.count or 0

        steps_map = self._fetch_steps([r["id"] for r in records])
        recipes = [
            self._to_domain(record, steps_map.get(str(record["id"]), []))
            for record in records
        ]
        return recipes, total

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
        now = datetime.now(timezone.utc)
        recipe_data = {
            "title": recipe.title,
            "author_alias": recipe.author_alias,
            "photo_url": recipe.photo_url,
            "prep_time_minutes": recipe.prep_time_minutes,
            "yield": recipe.yield_amount,
            "category": recipe.category,
            "rating": float(recipe.rating) if recipe.rating is not None else None,
            "tags": recipe.tags or [],
            "is_published": recipe.is_published,
            "is_community": recipe.is_community,
            "updated_at": datetime_to_iso(recipe.updated_at or now),
        }

        table(self.client, "recipes").update(recipe_data).eq(
            "id", str(recipe.recipe_id)
        ).execute()

        # Replace steps
        table(self.client, "recipe_steps").delete().eq(
            "recipe_id", str(recipe.recipe_id)
        ).execute()

        if recipe.steps:
            steps_payload = [
                {
                    "id": str(step.step_id),
                    "recipe_id": str(recipe.recipe_id),
                    "step_number": step.step_number,
                    "instruction_md": step.instruction_md,
                    "ingredients_json": step.ingredients_json,
                    "time_minutes": step.time_minutes,
                }
                for step in recipe.steps
            ]
            table(self.client, "recipe_steps").insert(steps_payload).execute()

        updated = self.get_by_id(recipe.recipe_id)
        return updated or recipe

    def delete(self, recipe_id: UUID) -> bool:
        """Delete recipe by ID."""
        # Remove steps first
        table(self.client, "recipe_steps").delete().eq(
            "recipe_id", str(recipe_id)
        ).execute()

        response = (
            table(self.client, "recipes").delete().eq("id", str(recipe_id)).execute()
        )
        return bool(response.data)

    def exists(self, recipe_id: UUID) -> bool:
        """Check if recipe exists."""
        response = (
            table(self.client, "recipes")
            .select("id", count="exact")
            .eq("id", str(recipe_id))
            .limit(1)
            .execute()
        )
        return bool(response.count and response.count > 0)

    # === FAVORITES ===

    def add_favorite(self, user_id: UUID, recipe_id: UUID) -> bool:
        """Add recipe to user favorites."""
        existing = (
            table(self.client, "user_favorite_recipes")
            .select("recipe_id", count="exact")
            .eq("user_id", str(user_id))
            .eq("recipe_id", str(recipe_id))
            .execute()
        )
        if existing.count and existing.count > 0:
            return False

        response = (
            table(self.client, "user_favorite_recipes")
            .insert({"user_id": str(user_id), "recipe_id": str(recipe_id)})
            .execute()
        )
        return bool(response.data)

    def remove_favorite(self, user_id: UUID, recipe_id: UUID) -> bool:
        """Remove recipe from user favorites."""
        response = (
            table(self.client, "user_favorite_recipes")
            .delete()
            .eq("user_id", str(user_id))
            .eq("recipe_id", str(recipe_id))
            .execute()
        )
        return bool(response.data)

    def is_favorite(self, user_id: UUID, recipe_id: UUID) -> bool:
        """Check if recipe is in user favorites."""
        response = (
            table(self.client, "user_favorite_recipes")
            .select("recipe_id", count="exact")
            .eq("user_id", str(user_id))
            .eq("recipe_id", str(recipe_id))
            .execute()
        )
        return bool(response.count and response.count > 0)

    def get_user_favorites(
        self,
        user_id: UUID,
        page: int = 1,
        page_size: int = 10,
        category: Optional[str] = None,
        search: Optional[str] = None,
    ) -> Tuple[List[DomainRecipe], int]:
        """Get user favorite recipes."""
        favorite_ids = [fid for fid in self.get_user_favorite_ids(user_id) if fid]
        if not favorite_ids:
            return [], 0

        id_strings = [str(rid) for rid in favorite_ids]

        query = (
            table(self.client, "recipes")
            .select("*", count="exact")
            .in_("id", id_strings)
        )
        if category:
            query = query.eq("category", category)
        if search:
            like = f"%{search}%"
            query = query.or_(f"title.ilike.{like},author_alias.ilike.{like}")

        start, end = page_range(page, page_size)
        response = query.order("created_at", desc=True).range(start, end).execute()

        records: List[Dict[str, Any]] = response.data or []
        total = response.count or 0

        steps_map = self._fetch_steps([r["id"] for r in records])
        recipes = [
            self._to_domain(record, steps_map.get(str(record["id"]), []))
            for record in records
        ]
        return recipes, total

    def get_user_favorite_ids(self, user_id: UUID) -> List[UUID]:
        """Get list of recipe IDs that user has favorited."""
        response = (
            table(self.client, "user_favorite_recipes")
            .select("recipe_id")
            .eq("user_id", str(user_id))
            .execute()
        )
        favorite_ids: List[UUID] = []
        for item in response.data or []:
            recipe_id = to_uuid(item.get("recipe_id"))
            if recipe_id:
                favorite_ids.append(recipe_id)
        return favorite_ids

    # === Internal helpers ===

    def _fetch_steps(self, recipe_ids: List[str]) -> Dict[str, List[DomainRecipeStep]]:
        """Fetch steps for a collection of recipes."""
        recipe_ids = [rid for rid in recipe_ids if rid]
        if not recipe_ids:
            return {}

        response = (
            table(self.client, "recipe_steps")
            .select("*")
            .in_("recipe_id", [str(rid) for rid in recipe_ids])
            .order("step_number", desc=False)
            .execute()
        )

        steps_map: Dict[str, List[DomainRecipeStep]] = {}
        for record in response.data or []:
            rid = str(record.get("recipe_id"))
            steps_map.setdefault(rid, []).append(self._to_domain_step(record))

        for rid in steps_map:
            steps_map[rid] = sorted(steps_map[rid], key=lambda s: s.step_number)
        return steps_map

    def _to_domain_step(self, record: Dict[str, Any]) -> DomainRecipeStep:
        """Convert Supabase record to domain recipe step."""
        return DomainRecipeStep(
            step_id=to_uuid(record.get("id")),
            recipe_id=to_uuid(record.get("recipe_id")),
            step_number=record.get("step_number") or 0,
            instruction_md=record.get("instruction_md") or "",
            ingredients_json=record.get("ingredients_json") or [],
            time_minutes=record.get("time_minutes"),
        )

    def _to_domain(
        self, record: Dict[str, Any], steps: List[DomainRecipeStep]
    ) -> DomainRecipe:
        """Convert Supabase record to domain recipe."""
        rating_value = record.get("rating")
        rating_decimal = (
            Decimal(str(rating_value)) if rating_value is not None else None
        )

        return DomainRecipe(
            recipe_id=to_uuid(record.get("id")),
            title=record.get("title"),
            author_user_id=to_uuid(record.get("author_user_id")),
            author_alias=record.get("author_alias"),
            photo_url=record.get("photo_url"),
            prep_time_minutes=record.get("prep_time_minutes"),
            yield_amount=record.get("yield"),
            category=record.get("category"),
            rating=rating_decimal,
            tags=record.get("tags") or [],
            is_published=bool(record.get("is_published", False)),
            is_community=bool(record.get("is_community", False)),
            created_at=to_datetime(record.get("created_at")),
            updated_at=to_datetime(record.get("updated_at")),
            steps=steps,
        )

