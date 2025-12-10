"""Supabase client configuration (replaces SQLAlchemy engine)."""

from functools import lru_cache
from typing import Generator

from supabase import Client, ClientOptions, create_client

from ...config.settings import settings


def _build_client() -> Client:
    """Create a Supabase client configured for the target schema."""
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise ValueError("Supabase URL and service role key must be configured")

    try:
        options = ClientOptions(schema=settings.supabase_schema)
        return create_client(
            settings.supabase_url,
            settings.supabase_service_role_key,
            options=options,
        )
    except Exception:
        # Fallback for clients that don't expose ClientOptions in this version
        return create_client(settings.supabase_url, settings.supabase_service_role_key)


@lru_cache(maxsize=1)
def get_supabase_client() -> Client:
    """Return a cached Supabase client instance."""
    return _build_client()


def get_db() -> Generator[Client, None, None]:
    """FastAPI dependency that yields the Supabase client."""
    client = get_supabase_client()
    yield client


get_db_session = get_db
