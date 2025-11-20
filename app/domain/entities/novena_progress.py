"""Novena progress domain entity."""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from uuid import UUID


@dataclass
class UserNovenaProgress:
    """User novena progress domain entity."""

    user_id: UUID
    day_id: UUID
    is_completed: bool = False
    completed_at: Optional[datetime] = None
    last_read_at: Optional[datetime] = None
