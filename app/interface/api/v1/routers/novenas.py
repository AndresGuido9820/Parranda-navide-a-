"""Novenas router."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.application.dtos.auth import UserResponse
from app.application.dtos.novenas import (
    CreateNovenaDayRequest,
    CreateNovenaSectionRequest,
    MarkDayCompleteRequest,
    NovenaDayListResponse,
    NovenaDayResponse,
    NovenaSectionResponse,
    UpdateNovenaDayRequest,
    UpdateNovenaSectionRequest,
    UserProgressListResponse,
    UserProgressResponse,
)
from app.application.dtos.response import APIResponse
from app.application.use_cases.novenas import (
    CreateNovenaDayUseCase,
    CreateNovenaSectionUseCase,
    DeleteNovenaDayUseCase,
    DeleteNovenaSectionUseCase,
    GetNovenaDayUseCase,
    GetUserProgressUseCase,
    ListNovenaDaysUseCase,
    MarkDayCompleteUseCase,
    NovenaDayNotFoundError,
    NovenaSectionNotFoundError,
    ResetProgressUseCase,
    UpdateNovenaDayUseCase,
    UpdateNovenaSectionUseCase,
    UpdateProgressUseCase,
)
from app.infrastructure.persistence.sqlalchemy.engine import get_db_session
from app.infrastructure.persistence.sqlalchemy.repositories.novena import (
    NovenaRepository,
)
from app.interface.api.v1.dependencies.auth import (
    get_current_user,
    get_current_user_optional,
)

router = APIRouter(prefix="/novenas", tags=["Novenas"])


def get_novena_repo(db: Session = Depends(get_db_session)) -> NovenaRepository:
    """Get novena repository dependency."""
    return NovenaRepository(db)


# === NOVENA DAYS ===


@router.get("", response_model=APIResponse)
async def list_novena_days(
    include_sections: bool = Query(False, description="Include sections content"),
    repo: NovenaRepository = Depends(get_novena_repo),
):
    """List all novena days."""
    use_case = ListNovenaDaysUseCase(repo)
    result = use_case.execute(include_sections=include_sections)
    return APIResponse(
        success=True,
        message="Novena days retrieved successfully",
        data=result.model_dump(),
    )


@router.get("/day/{day_number}", response_model=APIResponse)
async def get_novena_day(
    day_number: int,
    repo: NovenaRepository = Depends(get_novena_repo),
):
    """Get novena day by number (1-9) with sections."""
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


@router.get("/{day_id}", response_model=APIResponse)
async def get_novena_day_by_id(
    day_id: UUID,
    repo: NovenaRepository = Depends(get_novena_repo),
):
    """Get novena day by ID with sections."""
    use_case = GetNovenaDayUseCase(repo)
    try:
        result = use_case.execute_by_id(day_id)
        return APIResponse(
            success=True,
            message="Novena day retrieved successfully",
            data=result.model_dump(),
        )
    except NovenaDayNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Day with ID {day_id} not found",
        )


@router.post("", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_novena_day(
    request: CreateNovenaDayRequest,
    current_user: UserResponse = Depends(get_current_user),
    repo: NovenaRepository = Depends(get_novena_repo),
):
    """Create a new novena day (admin only)."""
    use_case = CreateNovenaDayUseCase(repo)
    try:
        result = use_case.execute(request)
        return APIResponse(
            success=True,
            message=f"Day {request.day_number} created successfully",
            data=result.model_dump(),
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.patch("/{day_id}", response_model=APIResponse)
async def update_novena_day(
    day_id: UUID,
    request: UpdateNovenaDayRequest,
    current_user: UserResponse = Depends(get_current_user),
    repo: NovenaRepository = Depends(get_novena_repo),
):
    """Update a novena day (admin only)."""
    use_case = UpdateNovenaDayUseCase(repo)
    try:
        result = use_case.execute(day_id, request)
        return APIResponse(
            success=True,
            message="Novena day updated successfully",
            data=result.model_dump(),
        )
    except NovenaDayNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Day with ID {day_id} not found",
        )


@router.delete("/{day_id}", response_model=APIResponse)
async def delete_novena_day(
    day_id: UUID,
    current_user: UserResponse = Depends(get_current_user),
    repo: NovenaRepository = Depends(get_novena_repo),
):
    """Delete a novena day (admin only)."""
    use_case = DeleteNovenaDayUseCase(repo)
    try:
        use_case.execute(day_id)
        return APIResponse(
            success=True,
            message="Novena day deleted successfully",
            data=None,
        )
    except NovenaDayNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Day with ID {day_id} not found",
        )


# === NOVENA SECTIONS ===


@router.post(
    "/{day_id}/sections",
    response_model=APIResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_section(
    day_id: UUID,
    request: CreateNovenaSectionRequest,
    current_user: UserResponse = Depends(get_current_user),
    repo: NovenaRepository = Depends(get_novena_repo),
):
    """Create a new section for a day (admin only)."""
    use_case = CreateNovenaSectionUseCase(repo)
    try:
        result = use_case.execute(day_id, request)
        return APIResponse(
            success=True,
            message="Section created successfully",
            data=result.model_dump(),
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.patch("/sections/{section_id}", response_model=APIResponse)
async def update_section(
    section_id: UUID,
    request: UpdateNovenaSectionRequest,
    current_user: UserResponse = Depends(get_current_user),
    repo: NovenaRepository = Depends(get_novena_repo),
):
    """Update a section (admin only)."""
    use_case = UpdateNovenaSectionUseCase(repo)
    try:
        result = use_case.execute(section_id, request)
        return APIResponse(
            success=True,
            message="Section updated successfully",
            data=result.model_dump(),
        )
    except NovenaSectionNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Section with ID {section_id} not found",
        )


@router.delete("/sections/{section_id}", response_model=APIResponse)
async def delete_section(
    section_id: UUID,
    current_user: UserResponse = Depends(get_current_user),
    repo: NovenaRepository = Depends(get_novena_repo),
):
    """Delete a section (admin only)."""
    use_case = DeleteNovenaSectionUseCase(repo)
    try:
        use_case.execute(section_id)
        return APIResponse(
            success=True,
            message="Section deleted successfully",
            data=None,
        )
    except NovenaSectionNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Section with ID {section_id} not found",
        )


# === USER PROGRESS ===


@router.get("/progress/me", response_model=APIResponse)
async def get_my_progress(
    current_user: UserResponse = Depends(get_current_user),
    repo: NovenaRepository = Depends(get_novena_repo),
):
    """Get current user's novena progress."""
    use_case = GetUserProgressUseCase(repo)
    result = use_case.execute(UUID(current_user.id))
    return APIResponse(
        success=True,
        message="Progress retrieved successfully",
        data=result.model_dump(),
    )


@router.get("/progress/me/day/{day_number}", response_model=APIResponse)
async def get_my_day_progress(
    day_number: int,
    current_user: UserResponse = Depends(get_current_user),
    repo: NovenaRepository = Depends(get_novena_repo),
):
    """Get current user's progress for a specific day."""
    use_case = GetUserProgressUseCase(repo)
    result = use_case.execute_for_day(UUID(current_user.id), day_number)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Day {day_number} not found",
        )
    return APIResponse(
        success=True,
        message=f"Progress for day {day_number} retrieved successfully",
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


@router.post("/progress/read/{day_number}", response_model=APIResponse)
async def update_last_read(
    day_number: int,
    current_user: UserResponse = Depends(get_current_user),
    repo: NovenaRepository = Depends(get_novena_repo),
):
    """Update last read timestamp for a day."""
    use_case = UpdateProgressUseCase(repo)
    try:
        result = use_case.execute(UUID(current_user.id), day_number)
        return APIResponse(
            success=True,
            message=f"Last read updated for day {day_number}",
            data=result.model_dump(),
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete("/progress/reset", response_model=APIResponse)
async def reset_progress(
    current_user: UserResponse = Depends(get_current_user),
    repo: NovenaRepository = Depends(get_novena_repo),
):
    """Reset all progress for current user."""
    use_case = ResetProgressUseCase(repo)
    use_case.execute(UUID(current_user.id))
    return APIResponse(
        success=True,
        message="Progress reset successfully",
        data=None,
    )
