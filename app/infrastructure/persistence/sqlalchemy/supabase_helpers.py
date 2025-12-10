"""Small helpers to work with the Supabase Python client."""

from datetime import datetime
from typing import Any, Optional, Tuple
from uuid import UUID

from supabase import Client

from app.infrastructure.config.settings import settings


def table(client: Client, name: str):
    """Return a table query builder using the configured schema."""
    try:
        return client.table(name, schema=settings.supabase_schema)
    except TypeError:
        pass

    if hasattr(client, "schema"):
        try:
            return client.schema(settings.supabase_schema).table(name)
        except Exception:
            pass

    return client.table(name)


def to_uuid(value: Any) -> Optional[UUID]:
    """Convert incoming value to UUID if possible."""
    if value is None:
        return None
    if isinstance(value, UUID):
        return value
    try:
        return UUID(str(value))
    except Exception:
        return None


def to_datetime(value: Any) -> Optional[datetime]:
    """Convert ISO strings coming from Supabase into datetime objects."""
    if value is None or isinstance(value, datetime):
        return value

    if isinstance(value, str):
        cleaned = value.replace("Z", "+00:00")
        try:
            return datetime.fromisoformat(cleaned)
        except Exception:
            return None

    return None


def datetime_to_iso(value: Optional[datetime]) -> Optional[str]:
    """Convert datetime objects to ISO strings for Supabase."""
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.isoformat()
    return str(value) if value else None


def page_range(page: int, page_size: int) -> Tuple[int, int]:
    """Calculate Supabase range (inclusive) for pagination."""
    start = max(page - 1, 0) * page_size
    end = start + page_size - 1
    return start, end


