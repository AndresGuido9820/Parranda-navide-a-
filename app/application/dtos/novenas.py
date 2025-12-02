"""Novenas DTOs."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

# === NOVENA DAY SECTION ===


class NovenaSectionResponse(BaseModel):
    """Novena section response DTO."""

    id: str
    section_type: str = Field(description="ORACION, GOZO, VILLANCICO")
    position: int
    content_md: str

    class Config:
        from_attributes = True


class CreateNovenaSectionRequest(BaseModel):
    """Create novena section request DTO."""

    section_type: str = Field(description="ORACION, GOZO, VILLANCICO")
    position: int = 1
    content_md: str


class UpdateNovenaSectionRequest(BaseModel):
    """Update novena section request DTO."""

    section_type: Optional[str] = None
    position: Optional[int] = None
    content_md: Optional[str] = None


# === NOVENA DAY ===


class NovenaDayResponse(BaseModel):
    """Novena day response DTO."""

    id: str
    day_number: int
    title: str
    sections: List[NovenaSectionResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


class NovenaDayListResponse(BaseModel):
    """Novena day list response DTO."""

    days: List[NovenaDayResponse]
    total: int


class CreateNovenaDayRequest(BaseModel):
    """Create novena day request DTO."""

    day_number: int = Field(ge=1, le=9)
    title: str = Field(min_length=1, max_length=100)
    sections: List[CreateNovenaSectionRequest] = []


class UpdateNovenaDayRequest(BaseModel):
    """Update novena day request DTO."""

    title: Optional[str] = Field(None, min_length=1, max_length=100)


# === USER PROGRESS ===


class UserProgressResponse(BaseModel):
    """User progress response DTO."""

    day_id: str
    day_number: int
    day_title: str
    is_completed: bool
    completed_at: Optional[datetime] = None
    last_read_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserProgressListResponse(BaseModel):
    """User progress list response DTO."""

    progress: List[UserProgressResponse]
    completed_count: int
    total_days: int


class MarkDayCompleteRequest(BaseModel):
    """Mark day as complete request DTO."""

    day_number: int = Field(ge=1, le=9)


class UpdateProgressRequest(BaseModel):
    """Update progress request DTO."""

    is_completed: Optional[bool] = None
