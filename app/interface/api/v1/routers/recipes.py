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
    repo: RecipeRepository = Depends(get_recipe_repository),
):
    """List community recipes."""
    use_case = ListRecipesUseCase(repo)
    result = use_case.execute_community(
        page=page,
        page_size=page_size,
        category=category,
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

