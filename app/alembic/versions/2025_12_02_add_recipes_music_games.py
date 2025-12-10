"""Add recipes, music and games tables

Revision ID: a1b2c3d4e5f6
Revises: 5be08bbc5d72
Create Date: 2025-12-02 10:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "5be08bbc5d72"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema - Add recipes, music and games tables."""

    # Add avatar_url column to users table
    op.add_column(
        "users",
        sa.Column("avatar_url", sa.Text(), nullable=True),
        schema="parranda",
    )

    # ==================== RECIPES ====================

    # Create recipes table
    op.create_table(
        "recipes",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column(
            "author_user_id",
            sa.UUID(),
            sa.ForeignKey("parranda.users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("author_alias", sa.Text(), nullable=True),
        sa.Column("photo_url", sa.Text(), nullable=True),
        sa.Column("prep_time_minutes", sa.Integer(), nullable=True),
        sa.Column("yield", sa.Text(), nullable=True),
        sa.Column("category", sa.Text(), nullable=True),
        sa.Column("rating", sa.Numeric(precision=2, scale=1), nullable=True),
        sa.Column("tags", postgresql.ARRAY(sa.Text()), nullable=True),
        sa.Column("is_published", sa.Boolean(), nullable=False, default=False),
        sa.Column("is_community", sa.Boolean(), nullable=False, default=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        schema="parranda",
    )

    # Create indexes for recipes
    op.create_index(
        "idx_recipes_author_user_id",
        "recipes",
        ["author_user_id"],
        schema="parranda",
    )
    op.create_index(
        "idx_recipes_category",
        "recipes",
        ["category"],
        schema="parranda",
    )
    op.create_index(
        "idx_recipes_is_published",
        "recipes",
        ["is_published"],
        schema="parranda",
    )

    # Create recipe_steps table
    op.create_table(
        "recipe_steps",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column(
            "recipe_id",
            sa.UUID(),
            sa.ForeignKey("parranda.recipes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("step_number", sa.Integer(), nullable=False),
        sa.Column("instruction_md", sa.Text(), nullable=False),
        sa.Column("ingredients_json", postgresql.JSONB(), nullable=True),
        sa.Column("time_minutes", sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        schema="parranda",
    )

    op.create_index(
        "idx_recipe_steps_recipe_id",
        "recipe_steps",
        ["recipe_id"],
        schema="parranda",
    )

    # Create recipe_ratings table
    op.create_table(
        "recipe_ratings",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column(
            "user_id",
            sa.UUID(),
            sa.ForeignKey("parranda.users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "recipe_id",
            sa.UUID(),
            sa.ForeignKey("parranda.recipes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "recipe_id", name="uq_user_recipe_rating"),
        schema="parranda",
    )

    op.create_index(
        "idx_recipe_ratings_recipe_id",
        "recipe_ratings",
        ["recipe_id"],
        schema="parranda",
    )

    # Create user_favorite_recipes table
    op.create_table(
        "user_favorite_recipes",
        sa.Column(
            "user_id",
            sa.UUID(),
            sa.ForeignKey("parranda.users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "recipe_id",
            sa.UUID(),
            sa.ForeignKey("parranda.recipes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("user_id", "recipe_id"),
        schema="parranda",
    )

    # ==================== MUSIC ====================

    # Create songs table
    op.create_table(
        "songs",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("youtube_video_id", sa.String(20), nullable=False),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("artist", sa.Text(), nullable=False),
        sa.Column("thumbnail_url", sa.Text(), nullable=True),
        sa.Column("duration_seconds", sa.Integer(), nullable=True),
        sa.Column("genre", sa.Text(), nullable=True),
        sa.Column("is_christmas", sa.Boolean(), default=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, default=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("youtube_video_id"),
        schema="parranda",
    )

    op.create_index(
        "idx_songs_youtube_video_id",
        "songs",
        ["youtube_video_id"],
        schema="parranda",
    )
    op.create_index(
        "idx_songs_genre",
        "songs",
        ["genre"],
        schema="parranda",
    )

    # Create playlists table
    op.create_table(
        "playlists",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column(
            "user_id",
            sa.UUID(),
            sa.ForeignKey("parranda.users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("name", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_public", sa.Boolean(), nullable=False, default=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        schema="parranda",
    )

    op.create_index(
        "idx_playlists_user_id",
        "playlists",
        ["user_id"],
        schema="parranda",
    )

    # Create playlist_songs table
    op.create_table(
        "playlist_songs",
        sa.Column(
            "playlist_id",
            sa.UUID(),
            sa.ForeignKey("parranda.playlists.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "song_id",
            sa.UUID(),
            sa.ForeignKey("parranda.songs.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column(
            "added_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("playlist_id", "song_id"),
        schema="parranda",
    )

    # Create user_favorite_songs table
    op.create_table(
        "user_favorite_songs",
        sa.Column(
            "user_id",
            sa.UUID(),
            sa.ForeignKey("parranda.users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "song_id",
            sa.UUID(),
            sa.ForeignKey("parranda.songs.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("user_id", "song_id"),
        schema="parranda",
    )

    # ==================== GAMES ====================

    # Create user_game_stats table
    op.create_table(
        "user_game_stats",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column(
            "user_id",
            sa.UUID(),
            sa.ForeignKey("parranda.users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("game_type", sa.String(50), nullable=False),
        sa.Column("games_played", sa.Integer(), nullable=False, default=0),
        sa.Column("games_won", sa.Integer(), nullable=False, default=0),
        sa.Column("best_score", sa.Integer(), nullable=True),
        sa.Column("total_score", sa.Integer(), default=0),
        sa.Column("last_played_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "game_type", name="uq_user_game_type"),
        schema="parranda",
    )

    op.create_index(
        "idx_user_game_stats_user_id",
        "user_game_stats",
        ["user_id"],
        schema="parranda",
    )

    # Create ano_viejo_configs table
    op.create_table(
        "ano_viejo_configs",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column(
            "user_id",
            sa.UUID(),
            sa.ForeignKey("parranda.users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("name", sa.Text(), nullable=True),
        sa.Column("config_json", postgresql.JSONB(), nullable=False),
        sa.Column("is_burned", sa.Boolean(), nullable=False, default=False),
        sa.Column("burned_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        schema="parranda",
    )

    op.create_index(
        "idx_ano_viejo_configs_user_id",
        "ano_viejo_configs",
        ["user_id"],
        schema="parranda",
    )


def downgrade() -> None:
    """Downgrade schema - Remove recipes, music and games tables."""

    # Drop games tables
    op.drop_index(
        "idx_ano_viejo_configs_user_id",
        table_name="ano_viejo_configs",
        schema="parranda",
    )
    op.drop_table("ano_viejo_configs", schema="parranda")

    op.drop_index(
        "idx_user_game_stats_user_id", table_name="user_game_stats", schema="parranda"
    )
    op.drop_table("user_game_stats", schema="parranda")

    # Drop music tables
    op.drop_table("user_favorite_songs", schema="parranda")
    op.drop_table("playlist_songs", schema="parranda")
    op.drop_index("idx_playlists_user_id", table_name="playlists", schema="parranda")
    op.drop_table("playlists", schema="parranda")
    op.drop_index("idx_songs_genre", table_name="songs", schema="parranda")
    op.drop_index("idx_songs_youtube_video_id", table_name="songs", schema="parranda")
    op.drop_table("songs", schema="parranda")

    # Drop recipes tables
    op.drop_table("user_favorite_recipes", schema="parranda")
    op.drop_index(
        "idx_recipe_ratings_recipe_id", table_name="recipe_ratings", schema="parranda"
    )
    op.drop_table("recipe_ratings", schema="parranda")
    op.drop_index(
        "idx_recipe_steps_recipe_id", table_name="recipe_steps", schema="parranda"
    )
    op.drop_table("recipe_steps", schema="parranda")
    op.drop_index("idx_recipes_is_published", table_name="recipes", schema="parranda")
    op.drop_index("idx_recipes_category", table_name="recipes", schema="parranda")
    op.drop_index("idx_recipes_author_user_id", table_name="recipes", schema="parranda")
    op.drop_table("recipes", schema="parranda")

    # Remove avatar_url from users
    op.drop_column("users", "avatar_url", schema="parranda")
