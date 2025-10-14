"""Refresh token use case."""

from uuid import UUID
from app.application.dtos.auth import RefreshTokenRequest, RefreshTokenResponse
from app.infrastructure.security.jwt_token_service import JWTTokenService
from app.infrastructure.persistence.sqlalchemy.repositories.session import SessionRepository
from app.domain.errors import UnauthorizedError


class RefreshTokenUseCase:
    """Use case for refreshing access tokens."""

    def __init__(
        self,
        jwt_service: JWTTokenService,
        session_repository: SessionRepository,
    ):
        self.jwt_service = jwt_service
        self.session_repository = session_repository

    def execute(self, request: RefreshTokenRequest) -> RefreshTokenResponse:
        """Refresh access token using refresh token."""
        # Verify refresh token
        payload = self.jwt_service.verify_refresh_token(request.refresh_token)
        if not payload:
            raise UnauthorizedError("Invalid refresh token")

        user_id = UUID(payload.get("sub"))
        
        # Check if session exists and is valid
        session = self.session_repository.get_by_token_hash(request.refresh_token)
        if not session or session.is_expired():
            raise UnauthorizedError("Invalid or expired refresh token")

        # Create new access token
        access_token = self.jwt_service.create_access_token(
            data={"sub": str(user_id)}
        )

        return RefreshTokenResponse(
            access_token=access_token,
            token_type="bearer"
        )
