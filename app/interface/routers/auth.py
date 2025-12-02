"""Authentication router."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from ...application.dtos.auth import (
    LoginRequest,
    MagicLinkRequest,
    RefreshTokenRequest,
    RegisterRequest,
    UpdateProfileRequest,
    UserResponse,
)
from ...application.dtos.response import APIResponse
from ...application.use_cases.auth.login_user import LoginUserUseCase
from ...application.use_cases.auth.refresh_token import RefreshTokenUseCase
from ...application.use_cases.auth.register_user import RegisterUserUseCase
from ...application.use_cases.auth.update_profile import UpdateProfileUseCase
from ...infrastructure.persistence.sqlalchemy.engine import get_db_session
from ...infrastructure.persistence.sqlalchemy.repositories.session import (
    SessionRepository,
)
from ...infrastructure.persistence.sqlalchemy.repositories.user import UserRepository
from ...infrastructure.security.jwt_token_service import JWTTokenService
from ...interface.api.v1.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register", response_model=APIResponse, status_code=status.HTTP_201_CREATED
)
async def register(request: RegisterRequest, db: Session = Depends(get_db_session)):
    """Register a new user with email and password."""
    user_repository = UserRepository(db)
    use_case = RegisterUserUseCase(user_repository)
    user = use_case.execute(request)

    return APIResponse(success=True, message="User registered successfully", data=user)


@router.post("/login-password", response_model=APIResponse)
async def login_password(request: LoginRequest, db: Session = Depends(get_db_session)):
    """Login with email/password."""
    user_repository = UserRepository(db)
    session_repository = SessionRepository(db)
    jwt_service = JWTTokenService()
    use_case = LoginUserUseCase(user_repository, session_repository, jwt_service)
    auth_data = use_case.execute(request)

    return APIResponse(success=True, message="Login successful", data=auth_data)


@router.post("/login-email", status_code=status.HTTP_204_NO_CONTENT)
async def login_email(request: MagicLinkRequest, db: Session = Depends(get_db_session)):
    """Request magic link via email."""
    # TODO: Implement magic link functionality
    # For now, just return 204 (link sent if user exists)
    pass


@router.get("/me", response_model=APIResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    """Get current user."""
    return APIResponse(
        success=True, message="User retrieved successfully", data=current_user
    )


@router.patch("/me", response_model=APIResponse)
async def update_me(
    request: UpdateProfileRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
):
    """Update current user profile."""
    user_repository = UserRepository(db)
    use_case = UpdateProfileUseCase(user_repository)
    updated_user = use_case.execute(current_user.id, request)

    return APIResponse(
        success=True, message="Profile updated successfully", data=updated_user
    )


@router.post("/refresh", response_model=APIResponse)
async def refresh_token(
    request: RefreshTokenRequest, db: Session = Depends(get_db_session)
):
    """Refresh access token using refresh token."""
    session_repository = SessionRepository(db)
    jwt_service = JWTTokenService()
    use_case = RefreshTokenUseCase(jwt_service, session_repository)
    token_data = use_case.execute(request)

    return APIResponse(
        success=True, message="Token refreshed successfully", data=token_data
    )


@router.post("/logout", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def logout():
    """Logout user (client should remove token)."""
    # For JWT, logout is typically handled client-side by discarding the token
    # If session management is needed, it would be implemented here
    return APIResponse(success=True, message="Logout successful", data=None)
