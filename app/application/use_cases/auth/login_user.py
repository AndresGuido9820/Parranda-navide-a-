"""Login user use case."""

from datetime import datetime, timedelta, timezone

from app.application.dtos.auth import AuthResponse, LoginRequest, UserResponse
from app.application.ports.repositories.user_repository import UserRepository
from app.domain.entities.session import Session as SessionEntity
from app.domain.value_objects.email_address import EmailAddress
from app.infrastructure.persistence.sqlalchemy.repositories.session import (
    SessionRepository,
)
from app.infrastructure.security.jwt_token_service import JWTTokenService
from app.infrastructure.security.password_hasher import verify_password


class LoginUserUseCase:
    """Login user use case."""

    def __init__(
        self,
        user_repository: UserRepository,
        session_repository: SessionRepository,
        jwt_service: JWTTokenService,
    ):
        self.user_repository = user_repository
        self.session_repository = session_repository
        self.jwt_service = jwt_service

    def execute(self, request: LoginRequest) -> AuthResponse:
        """Execute user login."""
        # Get user by email
        user = self.user_repository.get_by_email(EmailAddress(request.email))
        if not user:
            raise ValueError("Invalid email or password")

        # Check if user is active
        if not user.is_active:
            raise ValueError("User account is deactivated")

        # Verify password
        if not user.password_hash or not verify_password(
            request.password, user.password_hash
        ):
            raise ValueError("Invalid email or password")

        # Create token pair
        token_data = {
            "sub": str(user.user_id),
            "email": str(user.email),
        }
        access_token, refresh_token = self.jwt_service.create_token_pair(
            data=token_data
        )

        # Create session
        session_token_hash = self.jwt_service.generate_session_token()
        expires_at = datetime.now(timezone.utc) + timedelta(
            days=30
        )  # 30 days for refresh token

        session = SessionEntity.create(
            user_id=user.user_id,
            session_token_hash=session_token_hash,
            expires_at=expires_at,
        )
        self.session_repository.add(session)

        # Return response
        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse(
                id=str(user.user_id),
                email=str(user.email),
                full_name=user.full_name,
                alias=user.alias,
                phone=user.phone,
                is_active=user.is_active,
                created_at=user.created_at,
                updated_at=user.updated_at,
            ),
        )
