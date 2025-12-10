"""Main FastAPI application."""

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

try:
    from mangum import Mangum  # type: ignore[import-not-found]
except ImportError:  # pragma: no cover - optional for local dev
    Mangum = None

from app.domain.errors import (
    ConflictError,
    NotFoundError,
    UnauthorizedError,
    ValidationError,
)
from app.interface.middleware.error_handler import (
    conflict_error_handler,
    general_exception_handler,
    http_exception_handler,
    not_found_error_handler,
    unauthorized_error_handler,
    validation_domain_error_handler,
    validation_exception_handler,
)
from app.interface.middleware.logging_middleware import logging_middleware

from .api.v1.routers.games import router as games_router
from .api.v1.routers.novenas import router as novenas_router
from .api.v1.routers.recipes import router as recipes_router
from .api.v1.routers.songs import router as songs_router
from .api.v1.routers.uploads import router as uploads_router
from .routers.auth import router as auth_router

# Create FastAPI app
app = FastAPI(
    title="Parranda Navideña API",
    description=(
        "API para autenticación, Novenas, Recetas y Comunidad, " "Música, Dinámicas"
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add middleware
app.middleware("http")(logging_middleware)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add exception handlers
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(UnauthorizedError, unauthorized_error_handler)
app.add_exception_handler(NotFoundError, not_found_error_handler)
app.add_exception_handler(ConflictError, conflict_error_handler)
app.add_exception_handler(ValidationError, validation_domain_error_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Include routers
app.include_router(auth_router, prefix="")
app.include_router(recipes_router, prefix="/api/v1")
app.include_router(songs_router, prefix="/api/v1")
app.include_router(games_router, prefix="/api/v1")
app.include_router(uploads_router, prefix="/api/v1")
app.include_router(novenas_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "¡Bienvenido a Parranda Navideña!",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


# AWS Lambda entrypoint
handler = Mangum(app) if Mangum else None
