"""Get current user use case."""


from app.application.ports.repositories.user_repository import UserRepository
from app.application.dtos.auth import UserResponse


class GetCurrentUserUseCase:
    """Get current user use case."""
    
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
    
    def execute(self, user_id: str) -> UserResponse:
        """Execute get current user."""
        # Get user by ID
        user = self.user_repository.get_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        # Check if user is active
        if not user.is_active:
            raise ValueError("User account is deactivated")
        
        # Return response
        return UserResponse(
            id=str(user.id),
            email=str(user.email),
            full_name=user.full_name,
            alias=user.alias,
            phone=user.phone,
            is_active=user.is_active,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )





