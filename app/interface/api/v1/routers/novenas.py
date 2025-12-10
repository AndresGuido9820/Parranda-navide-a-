"""Novenas router - Simplified."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from supabase import Client

from app.application.dtos.auth import UserResponse
from app.application.dtos.novenas import (
    MarkDayCompleteRequest,
)
from app.application.dtos.response import APIResponse
from app.application.use_cases.novenas import (
    GetNovenaDayUseCase,
    GetUserProgressUseCase,
    ListNovenaDaysUseCase,
    MarkDayCompleteUseCase,
    NovenaDayNotFoundError,
)
from app.infrastructure.persistence.sqlalchemy.engine import get_db_session
from app.infrastructure.persistence.sqlalchemy.repositories.novena import (
    NovenaRepository,
)
from app.interface.api.v1.dependencies.auth import get_current_user

router = APIRouter(prefix="/novenas", tags=["Novenas"])


def get_novena_repo(db: Client = Depends(get_db_session)) -> NovenaRepository:
    """Get novena repository dependency."""
    return NovenaRepository(db)


@router.get("", response_model=APIResponse)
async def list_novena_days(
    include_sections: bool = Query(False, description="Include sections content"),
    repo: NovenaRepository = Depends(get_novena_repo),
):
    """List all novena days (1-9)."""
    use_case = ListNovenaDaysUseCase(repo)
    result = use_case.execute(include_sections=include_sections)
    return APIResponse(
        success=True,
        message="Novena days retrieved successfully",
        data=result.model_dump(),
    )


@router.get("/{day_number}", response_model=APIResponse)
async def get_novena_day(
    day_number: int,
    repo: NovenaRepository = Depends(get_novena_repo),
):
    """Get novena day by number (1-9) with all sections."""
    if day_number < 1 or day_number > 9:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Day number must be between 1 and 9",
        )
    
    use_case = GetNovenaDayUseCase(repo)
    try:
        result = use_case.execute_by_number(day_number)
        return APIResponse(
            success=True,
            message=f"Day {day_number} retrieved successfully",
            data=result.model_dump(),
        )
    except NovenaDayNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Day {day_number} not found",
        )


@router.get("/progress/me", response_model=APIResponse)
async def get_my_progress(
    current_user: UserResponse = Depends(get_current_user),
    repo: NovenaRepository = Depends(get_novena_repo),
):
    """Get current user's novena progress for all days."""
    use_case = GetUserProgressUseCase(repo)
    result = use_case.execute(UUID(current_user.id))
    return APIResponse(
        success=True,
        message="Progress retrieved successfully",
        data=result.model_dump(),
    )


@router.post("/progress/complete", response_model=APIResponse)
async def mark_day_complete(
    request: MarkDayCompleteRequest,
    current_user: UserResponse = Depends(get_current_user),
    repo: NovenaRepository = Depends(get_novena_repo),
):
    """Mark a day as complete for current user."""
    use_case = MarkDayCompleteUseCase(repo)
    try:
        result = use_case.execute(UUID(current_user.id), request.day_number)
        return APIResponse(
            success=True,
            message=f"Day {request.day_number} marked as complete! 🎉",
            data=result.model_dump(),
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
