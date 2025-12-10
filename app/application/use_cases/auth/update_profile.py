"""Update user profile use case."""

from typing import Any, Dict

from ...dtos.auth import UpdateProfileRequest, UserResponse


class UpdateProfileUseCase:
    """Use case for updating user profile."""

    def __init__(self, user_repository: Any):
        self.user_repository = user_repository

    def execute(self, user_id: str, request: UpdateProfileRequest) -> UserResponse:
        """Update user profile."""
        # Get existing user to verify it exists
        user = self.user_repository.get_by_id(user_id)
        if not user:
            raise ValueError("User not found")

        # Build update data dict with only provided fields
        update_data: Dict[str, Any] = {}
        if request.full_name is not None:
            update_data["full_name"] = request.full_name
        if request.alias is not None:
            update_data["alias"] = request.alias
        if request.phone is not None:
            update_data["phone"] = request.phone
        if request.avatar_url is not None:
            update_data["avatar_url"] = request.avatar_url

        if update_data:
            updated_user = self.user_repository.update(user_id, update_data)
        else:
            updated_user = user

        return UserResponse(
            id=str(updated_user.user_id),
            email=str(updated_user.email),
            full_name=updated_user.full_name,
            alias=updated_user.alias,
            phone=updated_user.phone,
            avatar_url=updated_user.avatar_url,
            is_active=updated_user.is_active,
            created_at=updated_user.created_at,
            updated_at=updated_user.updated_at,
        )
