"""Centralized error handling middleware."""

import logging

from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.application.dtos.response import ErrorResponse
from app.domain.errors import (
    ConflictError,
    NotFoundError,
    UnauthorizedError,
    ValidationError,
)

logger = logging.getLogger(__name__)


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Handle HTTP exceptions."""
    message = (
        exc.detail
        if isinstance(exc.detail, str)
        else exc.detail.get("message", "An error occurred")
    )
    errors = (
        [str(exc.detail)]
        if isinstance(exc.detail, str)
        else exc.detail.get("errors", [str(exc.detail)])
    )

    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            success=False,
            message=message,
            errors=errors,
        ).dict(),
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Handle validation errors."""
    errors = []
    for error in exc.errors():
        field = " -> ".join(str(loc) for loc in error["loc"])
        errors.append(f"{field}: {error['msg']}")

    return JSONResponse(
        status_code=422,
        content=ErrorResponse(
            success=False, message="Validation error", errors=errors
        ).dict(),
    )


async def unauthorized_error_handler(
    request: Request, exc: UnauthorizedError
) -> JSONResponse:
    """Handle unauthorized errors."""
    error_message = str(exc) if str(exc) else "No autorizado"
    return JSONResponse(
        status_code=401,
        content=ErrorResponse(
            success=False, message=error_message, errors=[error_message]
        ).dict(),
    )


async def not_found_error_handler(request: Request, exc: NotFoundError) -> JSONResponse:
    """Handle not found errors."""
    return JSONResponse(
        status_code=404,
        content=ErrorResponse(
            success=False, message="Not found", errors=[str(exc)]
        ).dict(),
    )


async def conflict_error_handler(request: Request, exc: ConflictError) -> JSONResponse:
    """Handle conflict errors."""
    error_message = str(exc) if str(exc) else "Conflicto"
    return JSONResponse(
        status_code=409,
        content=ErrorResponse(
            success=False, message=error_message, errors=[error_message]
        ).dict(),
    )


async def validation_domain_error_handler(
    request: Request, exc: ValidationError
) -> JSONResponse:
    """Handle domain validation errors."""
    error_message = str(exc) if str(exc) else "Error de validación"
    return JSONResponse(
        status_code=400,
        content=ErrorResponse(
            success=False, message=error_message, errors=[error_message]
        ).dict(),
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle general exceptions."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)

    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            success=False,
            message="Internal server error",
            errors=["An unexpected error occurred"],
        ).dict(),
    )
