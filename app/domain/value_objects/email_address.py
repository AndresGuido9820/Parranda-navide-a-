"""Email address value object."""

import re
from typing import Union


class EmailAddress:
    """Email address value object."""

    def __init__(self, value: Union[str, "EmailAddress"]):
        if isinstance(value, EmailAddress):
            self._value = value._value
        else:
            self._value = self._validate(value)

    def _validate(self, value: str) -> str:
        """Validate email address format."""
        if not value or not isinstance(value, str):
            raise ValueError("Email address cannot be empty")

        # Basic email validation regex
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(pattern, value):
            raise ValueError(f"Invalid email address format: {value}")

        return value.lower().strip()

    def __str__(self) -> str:
        return self._value

    def __repr__(self) -> str:
        return f"EmailAddress('{self._value}')"

    def __eq__(self, other) -> bool:
        if isinstance(other, EmailAddress):
            return self._value == other._value
        return self._value == str(other)

    def __hash__(self) -> int:
        return hash(self._value)
