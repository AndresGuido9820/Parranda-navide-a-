"""Day code value object."""

from typing import Union


class DayCode:
    """Day code value object."""

    def __init__(self, value: Union[str, "DayCode"]):
        if isinstance(value, DayCode):
            self._value = value._value
        else:
            self._value = self._validate(value)

    def _validate(self, value: str) -> str:
        """Validate day code format."""
        if not value or not isinstance(value, str):
            raise ValueError("Day code cannot be empty")

        # Day code should be uppercase and alphanumeric
        if not value.isalnum():
            raise ValueError(f"Day code must be alphanumeric: {value}")

        return value.upper().strip()

    def __str__(self) -> str:
        return self._value

    def __repr__(self) -> str:
        return f"DayCode('{self._value}')"

    def __eq__(self, other) -> bool:
        if isinstance(other, DayCode):
            return self._value == other._value
        return self._value == str(other)

    def __hash__(self) -> int:
        return hash(self._value)
