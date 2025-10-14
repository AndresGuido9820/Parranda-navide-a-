"""Domain errors."""


class DomainError(Exception):
    """Base domain error."""
    pass


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
