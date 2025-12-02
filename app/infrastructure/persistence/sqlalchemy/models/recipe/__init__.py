"""Recipe models."""

import uuid

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    Text,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..base import Base


class Recipe(Base):
    """Recipe model."""

    __tablename__ = "recipes"
    __table_args__ = {"schema": "parranda"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(Text, nullable=False)
    author_user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("parranda.users.id", ondelete="SET NULL"),
        nullable=True,
    )
    author_alias = Column(Text)
    photo_url = Column(Text)
    prep_time_minutes = Column(Integer)
    yield_amount = Column("yield", Text)
    category = Column(Text)
    rating = Column(Numeric(2, 1))
    tags = Column(ARRAY(Text), default=[])
    is_published = Column(Boolean, default=False, nullable=False)
    is_community = Column(Boolean, default=False, nullable=False)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    author = relationship("User", back_populates="recipes")
    steps = relationship(
        "RecipeStep",
        back_populates="recipe",
        cascade="all, delete-orphan",
        order_by="RecipeStep.step_number",
    )
    ratings = relationship(
        "RecipeRating",
        back_populates="recipe",
        cascade="all, delete-orphan",
    )
    favorited_by = relationship(
        "UserFavoriteRecipe",
        back_populates="recipe",
        cascade="all, delete-orphan",
    )


class RecipeStep(Base):
    """Recipe step model."""

    __tablename__ = "recipe_steps"
    __table_args__ = {"schema": "parranda"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recipe_id = Column(
        UUID(as_uuid=True),
        ForeignKey("parranda.recipes.id", ondelete="CASCADE"),
        nullable=False,
    )
    step_number = Column(Integer, nullable=False)
    instruction_md = Column(Text, nullable=False)
    ingredients_json = Column(JSONB, default=[])
    time_minutes = Column(Integer)

    # Relationship
    recipe = relationship("Recipe", back_populates="steps")


class RecipeRating(Base):
    """Recipe rating model."""

    __tablename__ = "recipe_ratings"
    __table_args__ = {"schema": "parranda"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("parranda.users.id", ondelete="CASCADE"),
        nullable=False,
    )
    recipe_id = Column(
        UUID(as_uuid=True),
        ForeignKey("parranda.recipes.id", ondelete="CASCADE"),
        nullable=False,
    )
    rating = Column(Integer, nullable=False)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    user = relationship("User", back_populates="recipe_ratings")
    recipe = relationship("Recipe", back_populates="ratings")


class UserFavoriteRecipe(Base):
    """User favorite recipe model."""

    __tablename__ = "user_favorite_recipes"
    __table_args__ = {"schema": "parranda"}

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("parranda.users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    recipe_id = Column(
        UUID(as_uuid=True),
        ForeignKey("parranda.recipes.id", ondelete="CASCADE"),
        primary_key=True,
    )
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    user = relationship("User", back_populates="favorite_recipes")
    recipe = relationship("Recipe", back_populates="favorited_by")

