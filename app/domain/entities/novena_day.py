"""Novena day domain entity."""

from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4


class NovenaDay:
    """Novena day domain entity."""
    
    def __init__(
        self,
        day_number: int,
        title: str,
        id: Optional[UUID] = None,
        created_at: Optional[datetime] = None,
    ):
        self.id = id or uuid4()
        self.day_number = day_number
        self.title = title
        self.created_at = created_at or datetime.now()


class NovenaDaySection:
    """Novena day section domain entity."""
    
    def __init__(
        self,
        day_id: UUID,
        section_type: str,
        content_md: str,
        position: int = 1,
        id: Optional[UUID] = None,
    ):
        self.id = id or uuid4()
        self.day_id = day_id
        self.section_type = section_type
        self.position = position
        self.content_md = content_md
