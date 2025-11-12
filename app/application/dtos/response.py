"""Standard API response DTOs."""

from typing import Any, Optional

from pydantic import BaseModel


class APIResponse(BaseModel):
    """Standard API response wrapper."""

    success: bool
    message: str
    data: Optional[Any] = None
    errors: Optional[list] = None


class ErrorResponse(BaseModel):
    """Error response model."""

    success: bool = False
    message: str
    errors: list
    data: Optional[Any] = None
