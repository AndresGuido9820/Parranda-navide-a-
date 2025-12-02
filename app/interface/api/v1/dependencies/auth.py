"""Authentication dependencies."""

from typing import Optional
from uuid import UUID

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.application.dtos.auth import UserResponse
from app.application.use_cases.auth.get_current_user import GetCurrentUserUseCase
from app.domain.errors import NotFoundError, UnauthorizedError
from app.infrastructure.persistence.sqlalchemy.engine import get_db_session
from app.infrastructure.persistence.sqlalchemy.repositories.user import UserRepository
from app.infrastructure.security.jwt_token_service import JWTTokenService

security = HTTPBearer()
security_optional = HTTPBearer(auto_error=False)


def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db_session),
) -> UserResponse:
    """Get current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    jwt_service = JWTTokenService()
    payload = jwt_service.verify_access_token(token.credentials)
    if payload is None:
        raise credentials_exception

    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    try:
        user_repo = UserRepository(db)
        use_case = GetCurrentUserUseCase(user_repo)
        user = use_case.execute(UUID(user_id))
        return user
    except (UnauthorizedError, NotFoundError):
        raise credentials_exception


def get_current_user_optional(
    token: Optional[HTTPAuthorizationCredentials] = Depends(security_optional),
    db: Session = Depends(get_db_session),
) -> Optional[dict]:
    """Get current user if authenticated, None otherwise."""
    if not token:
        return None

    jwt_service = JWTTokenService()
    payload = jwt_service.verify_access_token(token.credentials)
    if payload is None:
        return None

    user_id: str = payload.get("sub")
    if user_id is None:
        return None

    try:
        user_repo = UserRepository(db)
        use_case = GetCurrentUserUseCase(user_repo)
        user = use_case.execute(UUID(user_id))
        return {"id": str(user.id), "email": user.email}
    except (UnauthorizedError, NotFoundError):
        return None
