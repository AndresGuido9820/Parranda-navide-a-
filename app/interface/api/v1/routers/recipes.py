"""Recipes router."""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.application.dtos.recipes import (
    CreateRecipeRequest,
    RecipeListResponse,
    RecipeResponse,
    UpdateRecipeRequest,
)
from app.application.dtos.response import APIResponse
from app.application.use_cases.recipes import (
    CreateRecipeUseCase,
    DeleteRecipeUseCase,
    GetRecipeUseCase,
    ListRecipesUseCase,
    UpdateRecipeUseCase,
)
from app.application.use_cases.recipes.get_recipe import RecipeNotFoundError
from app.infrastructure.persistence.sqlalchemy.engine import get_db_session
from app.infrastructure.persistence.sqlalchemy.repositories.recipe import (
    RecipeRepository,
)
from app.interface.api.v1.dependencies.auth import get_current_user_optional

router = APIRouter(prefix="/recipes", tags=["Recipes"])


def get_recipe_repository(db: Session = Depends(get_db_session)) -> RecipeRepository:
    """Get recipe repository dependency."""
    return RecipeRepository(db)


# === LIST RECIPES ===


@router.get("", response_model=APIResponse)
async def list_recipes(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=50, description="Items per page"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in title/author"),
    tags: Optional[List[str]] = Query(None, description="Filter by tags"),
    repo: RecipeRepository = Depends(get_recipe_repository),
):
    """List all published recipes with pagination and filters."""
    use_case = ListRecipesUseCase(repo)
    result = use_case.execute(
        page=page,
        page_size=page_size,
        category=category,
        is_published=True,
        search=search,
        tags=tags,
    )
    return APIResponse(
        success=True,
        message="Recipes retrieved successfully",
        data=result.model_dump(),
    )


@router.get("/community", response_model=APIResponse)
async def list_community_recipes(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None, description="Search in title"),
    repo: RecipeRepository = Depends(get_recipe_repository),
):
    """List community recipes."""
    use_case = ListRecipesUseCase(repo)
    result = use_case.execute_community(
        page=page,
        page_size=page_size,
        category=category,
        search=search,
    )
    return APIResponse(
        success=True,
        message="Community recipes retrieved successfully",
        data=result.model_dump(),
    )


@router.get("/my", response_model=APIResponse)
async def list_my_recipes(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None, description="Search in title"),
    current_user: Optional[dict] = Depends(get_current_user_optional),
    repo: RecipeRepository = Depends(get_recipe_repository),
):
    """List current user's recipes."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    use_case = ListRecipesUseCase(repo)
    result = use_case.execute_my_recipes(
        user_id=UUID(current_user["id"]),
        page=page,
        page_size=page_size,
        category=category,
        search=search,
    )
    return APIResponse(
        success=True,
        message="Your recipes retrieved successfully",
        data=result.model_dump(),
    )


# === GET RECIPE ===


@router.get("/{recipe_id}", response_model=APIResponse)
async def get_recipe(
    recipe_id: UUID,
    repo: RecipeRepository = Depends(get_recipe_repository),
):
    """Get recipe by ID."""
    use_case = GetRecipeUseCase(repo)
    try:
        result = use_case.execute(recipe_id)
        return APIResponse(
            success=True,
            message="Recipe retrieved successfully",
            data=result.model_dump(),
        )
    except RecipeNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recipe with ID {recipe_id} not found",
        )


# === CREATE RECIPE ===


@router.post("", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_recipe(
    request: CreateRecipeRequest,
    current_user: Optional[dict] = Depends(get_current_user_optional),
    repo: RecipeRepository = Depends(get_recipe_repository),
):
    """Create a new recipe."""
    use_case = CreateRecipeUseCase(repo)
    user_id = UUID(current_user["id"]) if current_user else None
    result = use_case.execute(request, user_id)
    return APIResponse(
        success=True,
        message="Recipe created successfully",
        data=result.model_dump(),
    )


# === UPDATE RECIPE ===


@router.patch("/{recipe_id}", response_model=APIResponse)
async def update_recipe(
    recipe_id: UUID,
    request: UpdateRecipeRequest,
    current_user: Optional[dict] = Depends(get_current_user_optional),
    repo: RecipeRepository = Depends(get_recipe_repository),
):
    """Update an existing recipe."""
    use_case = UpdateRecipeUseCase(repo)
    user_id = UUID(current_user["id"]) if current_user else None

    try:
        result = use_case.execute(recipe_id, request, user_id)
        return APIResponse(
            success=True,
            message="Recipe updated successfully",
            data=result.model_dump(),
        )
    except RecipeNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recipe with ID {recipe_id} not found",
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )


# === DELETE RECIPE ===


@router.delete("/{recipe_id}", response_model=APIResponse)
async def delete_recipe(
    recipe_id: UUID,
    current_user: Optional[dict] = Depends(get_current_user_optional),
    repo: RecipeRepository = Depends(get_recipe_repository),
):
    """Delete a recipe."""
    use_case = DeleteRecipeUseCase(repo)
    user_id = UUID(current_user["id"]) if current_user else None

    try:
        use_case.execute(recipe_id, user_id)
        return APIResponse(
            success=True,
            message="Recipe deleted successfully",
            data=None,
        )
    except RecipeNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recipe with ID {recipe_id} not found",
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )


# === FAVORITES ===


@router.get("/favorites/my", response_model=APIResponse)
async def list_my_favorites(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None, description="Search in title"),
    current_user: Optional[dict] = Depends(get_current_user_optional),
    repo: RecipeRepository = Depends(get_recipe_repository),
):
    """List current user's favorite recipes."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    recipes, total = repo.get_user_favorites(
        user_id=UUID(current_user["id"]),
        page=page,
        page_size=page_size,
        category=category,
        search=search,
    )

    recipe_responses = [
        RecipeResponse(
            id=str(r.recipe_id),
            title=r.title,
            author_user_id=str(r.author_user_id) if r.author_user_id else None,
            author_alias=r.author_alias,
            photo_url=r.photo_url,
            prep_time_minutes=r.prep_time_minutes,
            yield_amount=r.yield_amount,
            category=r.category,
            rating=float(r.rating) if r.rating else None,
            tags=r.tags,
            is_published=r.is_published,
            is_community=r.is_community,
            steps=[],
            created_at=r.created_at,
            updated_at=r.updated_at,
        )
        for r in recipes
    ]

    result = RecipeListResponse(
        items=recipe_responses,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size,
    )

    return APIResponse(
        success=True,
        message="Favorite recipes retrieved successfully",
        data=result.model_dump(),
    )


@router.get("/favorites/ids", response_model=APIResponse)
async def get_my_favorite_ids(
    current_user: Optional[dict] = Depends(get_current_user_optional),
    repo: RecipeRepository = Depends(get_recipe_repository),
):
    """Get list of recipe IDs that current user has favorited."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    favorite_ids = repo.get_user_favorite_ids(UUID(current_user["id"]))

    return APIResponse(
        success=True,
        message="Favorite IDs retrieved successfully",
        data={"favorite_ids": [str(fid) for fid in favorite_ids]},
    )


@router.post("/{recipe_id}/favorite", response_model=APIResponse)
async def add_favorite(
    recipe_id: UUID,
    current_user: Optional[dict] = Depends(get_current_user_optional),
    repo: RecipeRepository = Depends(get_recipe_repository),
):
    """Add recipe to favorites."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    if not repo.exists(recipe_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recipe with ID {recipe_id} not found",
        )

    added = repo.add_favorite(UUID(current_user["id"]), recipe_id)

    return APIResponse(
        success=True,
        message="Recipe added to favorites" if added else "Recipe already in favorites",
        data={"is_favorite": True},
    )


@router.delete("/{recipe_id}/favorite", response_model=APIResponse)
async def remove_favorite(
    recipe_id: UUID,
    current_user: Optional[dict] = Depends(get_current_user_optional),
    repo: RecipeRepository = Depends(get_recipe_repository),
):
    """Remove recipe from favorites."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    removed = repo.remove_favorite(UUID(current_user["id"]), recipe_id)

    return APIResponse(
        success=True,
        message="Recipe removed from favorites" if removed else "Recipe was not in favorites",
        data={"is_favorite": False},
    )

