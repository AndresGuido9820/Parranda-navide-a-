"""Register user use case."""

from app.application.dtos.auth import RegisterRequest, UserResponse
from app.application.ports.repositories.user_repository import UserRepository
from app.domain.entities.user import User
from app.domain.value_objects.email_address import EmailAddress
from app.infrastructure.security.password_hasher import hash_password


class RegisterUserUseCase:
    """Register new user use case."""

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def execute(self, request: RegisterRequest) -> UserResponse:
        """Execute user registration."""
        # Check if user already exists
        existing_user = self.user_repository.get_by_email(EmailAddress(request.email))
        if existing_user:
            raise ValueError("User with this email already exists")

        # Check alias uniqueness if provided
        if request.alias:
            existing_alias = self.user_repository.get_by_alias(request.alias)
            if existing_alias:
                raise ValueError("Alias already taken")

        # Create domain user
        user = User.create(
            email=EmailAddress(request.email),
            full_name=request.full_name,
            alias=request.alias,
            phone=request.phone,
        )

        # Hash password if provided
        if request.password:
            user.password_hash = hash_password(request.password)

        # Save user
        saved_user = self.user_repository.create(user)

        # Return response
        return UserResponse(
            id=str(saved_user.user_id),
            email=str(saved_user.email),
            full_name=saved_user.full_name,
            alias=saved_user.alias,
            phone=saved_user.phone,
            is_active=saved_user.is_active,
            created_at=saved_user.created_at,
            updated_at=saved_user.updated_at,
        )
