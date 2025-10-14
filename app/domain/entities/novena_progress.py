"""Novena progress domain entity."""

from datetime import datetime
from typing import Optional
from uuid import UUID


class UserNovenaProgress:
    """User novena progress domain entity."""
    
    def __init__(
        self,
        user_id: UUID,
        day_id: UUID,
        is_completed: bool = False,
        completed_at: Optional[datetime] = None,
        last_read_at: Optional[datetime] = None,
    ):
        self.user_id = user_id
        self.day_id = day_id
        self.is_completed = is_completed
        self.completed_at = completed_at
        self.last_read_at = last_read_at
