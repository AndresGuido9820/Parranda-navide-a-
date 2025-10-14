"""Authentication dependencies."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from uuid import UUID

from app.infrastructure.persistence.sqlalchemy.engine import get_db_session
from app.infrastructure.persistence.sqlalchemy.repositories.user import UserRepository
from app.infrastructure.security.jwt_token_service import JWTTokenService
from app.application.use_cases.auth.get_current_user import GetCurrentUserUseCase
from app.application.dtos.auth import UserResponse
from app.domain.errors import UnauthorizedError, NotFoundError

security = HTTPBearer()


def get_current_user(
    token: str = Depends(security),
    db: Session = Depends(get_db_session),
    jwt_service: JWTTokenService = Depends(JWTTokenService),
) -> UserResponse:
    """Get current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = jwt_service.verify_access_token(token)
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