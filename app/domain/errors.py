"""Domain errors."""


class DomainError(Exception):
    """Base domain error."""

    def __init__(self, message: str = ""):
        """Initialize domain error with message."""
        self.message = message
        super().__init__(message)


class NotFoundError(DomainError):
    """Resource not found error."""

    pass


class ConflictError(DomainError):
    """Resource conflict error."""

    pass


class UnauthorizedError(DomainError):
    """Unauthorized access error."""

    pass


class ValidationError(DomainError):
    """Validation error."""

    pass
