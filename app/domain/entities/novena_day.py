"""Novena day domain entity."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4


@dataclass
class NovenaDay:
    """Novena day domain entity."""

    day_number: int
    title: str
    day_id: Optional[UUID] = field(default_factory=uuid4)
    created_at: Optional[datetime] = field(default_factory=datetime.now)


@dataclass
class NovenaDaySection:
    """Novena day section domain entity."""

    day_id: UUID
    section_type: str
    content_md: str
    position: int = 1
    section_id: Optional[UUID] = field(default_factory=uuid4)
