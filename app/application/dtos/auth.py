"""Authentication DTOs."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    """User registration request."""

    email: EmailStr
    password: str
    full_name: Optional[str] = None
    alias: Optional[str] = None
    phone: Optional[str] = None


class LoginRequest(BaseModel):
    """User login request."""

    email: EmailStr
    password: str

    class Config:
        """Pydantic config."""

        json_schema_extra = {
            "example": {"email": "usuario@ejemplo.com", "password": "contraseña123"}
        }


class MagicLinkRequest(BaseModel):
    """Magic link request."""

    email: EmailStr


class UserResponse(BaseModel):
    """User response."""

    id: str
    email: str
    full_name: Optional[str] = None
    alias: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class AuthResponse(BaseModel):
    """Authentication response."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    """Refresh token request."""

    refresh_token: str


class RefreshTokenResponse(BaseModel):
    """Refresh token response."""

    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """JWT token data."""

    user_id: Optional[str] = None
    email: Optional[str] = None
