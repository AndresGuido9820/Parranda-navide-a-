"""Songs router."""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from supabase import Client

from app.application.dtos.response import APIResponse
from app.application.dtos.songs import (
    CreateSongRequest,
    SongListResponse,
    SongResponse,
    UpdateSongRequest,
)
from app.application.use_cases.songs import (
    CreateSongUseCase,
    DeleteSongUseCase,
    GetSongUseCase,
    ListSongsUseCase,
    SongNotFoundError,
    UpdateSongUseCase,
)
from app.infrastructure.persistence.sqlalchemy.engine import get_db_session
from app.infrastructure.persistence.sqlalchemy.repositories.song import SongRepository

router = APIRouter(prefix="/songs", tags=["Songs"])


def get_song_repository(db: Client = Depends(get_db_session)) -> SongRepository:
    """Get song repository dependency."""
    return SongRepository(db)


# === LIST SONGS ===


@router.get("", response_model=APIResponse)
async def list_songs(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    genre: Optional[str] = Query(None, description="Filter by genre"),
    is_christmas: Optional[bool] = Query(None, description="Filter Christmas songs"),
    search: Optional[str] = Query(None, description="Search in title/artist"),
    repo: SongRepository = Depends(get_song_repository),
):
    """List all songs with pagination and filters."""
    use_case = ListSongsUseCase(repo)
    result = use_case.execute(
        page=page,
        page_size=page_size,
        genre=genre,
        is_christmas=is_christmas,
        search=search,
    )
    return APIResponse(
        success=True,
        message="Songs retrieved successfully",
        data=result.model_dump(),
    )


# === GET SONG ===


@router.get("/{song_id}", response_model=APIResponse)
async def get_song(
    song_id: UUID,
    repo: SongRepository = Depends(get_song_repository),
):
    """Get song by ID."""
    use_case = GetSongUseCase(repo)
    try:
        result = use_case.execute(song_id)
        return APIResponse(
            success=True,
            message="Song retrieved successfully",
            data=result.model_dump(),
        )
    except SongNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Song with ID {song_id} not found",
        )


@router.get("/youtube/{youtube_id}", response_model=APIResponse)
async def get_song_by_youtube_id(
    youtube_id: str,
    repo: SongRepository = Depends(get_song_repository),
):
    """Get song by YouTube ID."""
    use_case = GetSongUseCase(repo)
    try:
        result = use_case.execute_by_youtube_id(youtube_id)
        return APIResponse(
            success=True,
            message="Song retrieved successfully",
            data=result.model_dump(),
        )
    except SongNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Song with YouTube ID {youtube_id} not found",
        )


# === CREATE SONG ===


@router.post("", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_song(
    request: CreateSongRequest,
    repo: SongRepository = Depends(get_song_repository),
):
    """Create a new song."""
    use_case = CreateSongUseCase(repo)
    result = use_case.execute(request)
    return APIResponse(
        success=True,
        message="Song created successfully",
        data=result.model_dump(),
    )


# === UPDATE SONG ===


@router.patch("/{song_id}", response_model=APIResponse)
async def update_song(
    song_id: UUID,
    request: UpdateSongRequest,
    repo: SongRepository = Depends(get_song_repository),
):
    """Update an existing song."""
    use_case = UpdateSongUseCase(repo)
    try:
        result = use_case.execute(song_id, request)
        return APIResponse(
            success=True,
            message="Song updated successfully",
            data=result.model_dump(),
        )
    except SongNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Song with ID {song_id} not found",
        )


# === DELETE SONG ===


@router.delete("/{song_id}", response_model=APIResponse)
async def delete_song(
    song_id: UUID,
    repo: SongRepository = Depends(get_song_repository),
):
    """Delete a song."""
    use_case = DeleteSongUseCase(repo)
    try:
        use_case.execute(song_id)
        return APIResponse(
            success=True,
            message="Song deleted successfully",
            data=None,
        )
    except SongNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Song with ID {song_id} not found",
        )

