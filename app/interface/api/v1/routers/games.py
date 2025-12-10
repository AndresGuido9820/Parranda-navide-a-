"""Games router."""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from supabase import Client

from app.application.dtos.auth import UserResponse
from app.application.dtos.games import (
    AnoViejoListResponse,
    AnoViejoResponse,
    CreateAnoViejoRequest,
    GameStatsListResponse,
    GameStatsResponse,
    UpdateAnoViejoRequest,
    UpdateGameStatsRequest,
)
from app.application.dtos.response import APIResponse
from app.application.use_cases.games import (
    AnoViejoNotFoundError,
    BurnAnoViejoUseCase,
    CreateAnoViejoUseCase,
    DeleteAnoViejoUseCase,
    GetAnoViejoUseCase,
    GetGameStatsUseCase,
    ListAnoViejoUseCase,
    UpdateAnoViejoUseCase,
    UpdateGameStatsUseCase,
)
from app.infrastructure.persistence.sqlalchemy.engine import get_db_session
from app.infrastructure.persistence.sqlalchemy.repositories.game import (
    AnoViejoRepository,
    GameStatsRepository,
)
from app.interface.api.v1.dependencies.auth import get_current_user, get_current_user_optional

router = APIRouter(prefix="/games", tags=["Games"])


def get_game_stats_repo(db: Client = Depends(get_db_session)) -> GameStatsRepository:
    """Get game stats repository dependency."""
    return GameStatsRepository(db)


def get_ano_viejo_repo(db: Client = Depends(get_db_session)) -> AnoViejoRepository:
    """Get año viejo repository dependency."""
    return AnoViejoRepository(db)


# === GAME STATS ===


@router.get("/stats", response_model=APIResponse)
async def get_my_game_stats(
    current_user: UserResponse = Depends(get_current_user),
    repo: GameStatsRepository = Depends(get_game_stats_repo),
):
    """Get all game stats for current user."""
    use_case = GetGameStatsUseCase(repo)
    result = use_case.execute(UUID(current_user.id))
    return APIResponse(
        success=True,
        message="Game stats retrieved successfully",
        data=result.model_dump(),
    )


@router.get("/stats/{game_type}", response_model=APIResponse)
async def get_game_stats_by_type(
    game_type: str,
    current_user: UserResponse = Depends(get_current_user),
    repo: GameStatsRepository = Depends(get_game_stats_repo),
):
    """Get stats for a specific game type."""
    use_case = GetGameStatsUseCase(repo)
    result = use_case.execute_by_game(UUID(current_user.id), game_type)
    return APIResponse(
        success=True,
        message=f"Stats for {game_type} retrieved successfully",
        data=result.model_dump(),
    )


@router.post("/stats", response_model=APIResponse)
async def update_game_stats(
    request: UpdateGameStatsRequest,
    current_user: UserResponse = Depends(get_current_user),
    repo: GameStatsRepository = Depends(get_game_stats_repo),
):
    """Update game stats after playing a game."""
    use_case = UpdateGameStatsUseCase(repo)
    result = use_case.execute(UUID(current_user.id), request)
    return APIResponse(
        success=True,
        message="Game stats updated successfully",
        data=result.model_dump(),
    )


# === AÑO VIEJO ===


@router.get("/ano-viejo", response_model=APIResponse)
async def list_ano_viejo(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    include_burned: bool = Query(True, description="Include burned configs"),
    current_user: UserResponse = Depends(get_current_user),
    repo: AnoViejoRepository = Depends(get_ano_viejo_repo),
):
    """List all Año Viejo configs for current user."""
    use_case = ListAnoViejoUseCase(repo)
    result = use_case.execute(
        user_id=UUID(current_user.id),
        page=page,
        page_size=page_size,
        include_burned=include_burned,
    )
    return APIResponse(
        success=True,
        message="Año Viejo configs retrieved successfully",
        data=result.model_dump(),
    )


@router.get("/ano-viejo/{config_id}", response_model=APIResponse)
async def get_ano_viejo(
    config_id: UUID,
    repo: AnoViejoRepository = Depends(get_ano_viejo_repo),
):
    """Get an Año Viejo by ID."""
    use_case = GetAnoViejoUseCase(repo)
    try:
        result = use_case.execute(config_id)
        return APIResponse(
            success=True,
            message="Año Viejo retrieved successfully",
            data=result.model_dump(),
        )
    except AnoViejoNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Año Viejo with ID {config_id} not found",
        )


@router.post("/ano-viejo", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_ano_viejo(
    request: CreateAnoViejoRequest,
    current_user: UserResponse = Depends(get_current_user),
    repo: AnoViejoRepository = Depends(get_ano_viejo_repo),
):
    """Create a new Año Viejo configuration."""
    use_case = CreateAnoViejoUseCase(repo)
    result = use_case.execute(UUID(current_user.id), request)
    return APIResponse(
        success=True,
        message="Año Viejo created successfully",
        data=result.model_dump(),
    )


@router.patch("/ano-viejo/{config_id}", response_model=APIResponse)
async def update_ano_viejo(
    config_id: UUID,
    request: UpdateAnoViejoRequest,
    current_user: UserResponse = Depends(get_current_user),
    repo: AnoViejoRepository = Depends(get_ano_viejo_repo),
):
    """Update an Año Viejo configuration."""
    use_case = UpdateAnoViejoUseCase(repo)
    try:
        result = use_case.execute(config_id, UUID(current_user.id), request)
        return APIResponse(
            success=True,
            message="Año Viejo updated successfully",
            data=result.model_dump(),
        )
    except AnoViejoNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Año Viejo with ID {config_id} not found",
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post("/ano-viejo/{config_id}/burn", response_model=APIResponse)
async def burn_ano_viejo(
    config_id: UUID,
    current_user: UserResponse = Depends(get_current_user),
    repo: AnoViejoRepository = Depends(get_ano_viejo_repo),
):
    """Burn an Año Viejo! 🔥"""
    use_case = BurnAnoViejoUseCase(repo)
    try:
        result = use_case.execute(config_id, UUID(current_user.id))
        return APIResponse(
            success=True,
            message="¡Año Viejo quemado exitosamente! 🔥 ¡Feliz Año Nuevo!",
            data=result.model_dump(),
        )
    except AnoViejoNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Año Viejo with ID {config_id} not found",
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete("/ano-viejo/{config_id}", response_model=APIResponse)
async def delete_ano_viejo(
    config_id: UUID,
    current_user: UserResponse = Depends(get_current_user),
    repo: AnoViejoRepository = Depends(get_ano_viejo_repo),
):
    """Delete an Año Viejo."""
    use_case = DeleteAnoViejoUseCase(repo)
    try:
        use_case.execute(config_id, UUID(current_user.id))
        return APIResponse(
            success=True,
            message="Año Viejo deleted successfully",
            data=None,
        )
    except AnoViejoNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Año Viejo with ID {config_id} not found",
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

