"""Initial migration for Parranda Navideña database schema

Revision ID: 2025_01_11_init
Revises: 
Create Date: 2025-01-11 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '2025_01_11_init'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create schema
    op.execute('CREATE SCHEMA IF NOT EXISTS parranda')
    
    # Create ENUM types
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE parranda.game_type AS ENUM ('FIND_BABY_JESUS', 'ANO_VIEJO');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """)
    
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE parranda.game_status AS ENUM ('NOT_STARTED', 'PLAYING', 'FINISHED');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """)
    
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE parranda.novena_section_type AS ENUM ('ORACIONES', 'GOZOS', 'VILLANCICOS');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """)
    
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE parranda.photo_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """)
    
    # Enable extensions
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    op.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')
    op.execute('CREATE EXTENSION IF NOT EXISTS "citext"')
    
    # Create tables
    op.create_table('users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('email', postgresql.CITEXT(), nullable=False),
        sa.Column('full_name', sa.Text(), nullable=True),
        sa.Column('alias', sa.Text(), nullable=True),
        sa.Column('phone', sa.Text(), nullable=True),
        sa.Column('password_hash', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('alias'),
        sa.UniqueConstraint('email'),
        schema='parranda'
    )
    
    op.create_table('sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('session_token_hash', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('user_agent', sa.Text(), nullable=True),
        sa.Column('ip_address', postgresql.INET(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['parranda.users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('session_token_hash'),
        schema='parranda'
    )
    
    op.create_table('novena_days',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('day_number', sa.Integer(), nullable=False),
        sa.Column('title', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('day_number'),
        schema='parranda'
    )
    
    op.create_table('novena_day_sections',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('day_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('section_type', sa.String(length=20), nullable=False),
        sa.Column('position', sa.Integer(), nullable=False, server_default=sa.text('1')),
        sa.Column('content_md', sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(['day_id'], ['parranda.novena_days.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('day_id', 'section_type', 'position', name='novena_day_sections_day_id_section_type_position_key'),
        schema='parranda'
    )
    
    op.create_table('user_novena_progress',
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('day_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('is_completed', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_read_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['day_id'], ['parranda.novena_days.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['parranda.users.id'], ),
        sa.PrimaryKeyConstraint('user_id', 'day_id'),
        schema='parranda'
    )
    
    op.create_table('recipes',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('title', sa.Text(), nullable=False),
        sa.Column('author_user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('author_alias', sa.Text(), nullable=True),
        sa.Column('photo_url', sa.Text(), nullable=True),
        sa.Column('prep_time_minutes', sa.Integer(), nullable=True),
        sa.Column('is_published', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['author_user_id'], ['parranda.users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        schema='parranda'
    )
    
    op.create_table('recipe_steps',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('recipe_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('step_number', sa.Integer(), nullable=False),
        sa.Column('instruction_md', sa.Text(), nullable=False),
        sa.Column('ingredients_json', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.ForeignKeyConstraint(['recipe_id'], ['parranda.recipes.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('recipe_id', 'step_number', name='recipe_steps_recipe_id_step_number_key'),
        schema='parranda'
    )
    
    op.create_table('recipe_ingredients',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('recipe_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('position', sa.Integer(), nullable=False, server_default=sa.text('1')),
        sa.Column('line_text', sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(['recipe_id'], ['parranda.recipes.id'], ),
        sa.PrimaryKeyConstraint('id'),
        schema='parranda'
    )
    
    op.create_table('recipe_photos',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('recipe_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('uploader_user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('alias', sa.Text(), nullable=True),
        sa.Column('photo_url', sa.Text(), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False, server_default=sa.text("'PENDING'")),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('moderated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('moderated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.ForeignKeyConstraint(['moderated_by'], ['parranda.users.id'], ),
        sa.ForeignKeyConstraint(['recipe_id'], ['parranda.recipes.id'], ),
        sa.ForeignKeyConstraint(['uploader_user_id'], ['parranda.users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        schema='parranda'
    )
    
    op.create_table('recipe_ratings',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('recipe_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('comment', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['recipe_id'], ['parranda.recipes.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['parranda.users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('recipe_id', 'user_id', name='recipe_ratings_recipe_id_user_id_key'),
        schema='parranda'
    )
    
    op.create_table('recipe_favorites',
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('recipe_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['recipe_id'], ['parranda.recipes.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['parranda.users.id'], ),
        sa.PrimaryKeyConstraint('user_id', 'recipe_id'),
        schema='parranda'
    )
    
    op.create_table('music_tracks',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('title', sa.Text(), nullable=False),
        sa.Column('artist', sa.Text(), nullable=True),
        sa.Column('album', sa.Text(), nullable=True),
        sa.Column('duration_ms', sa.Integer(), nullable=True),
        sa.Column('audio_url', sa.Text(), nullable=False),
        sa.Column('cover_url', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        schema='parranda'
    )
    
    op.create_table('playback_queues',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['session_id'], ['parranda.sessions.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['parranda.users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        schema='parranda'
    )
    
    op.create_table('playback_queue_items',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('queue_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('track_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('position', sa.Integer(), nullable=False),
        sa.Column('added_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['queue_id'], ['parranda.playback_queues.id'], ),
        sa.ForeignKeyConstraint(['track_id'], ['parranda.music_tracks.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('queue_id', 'position', name='playback_queue_items_queue_id_position_key'),
        schema='parranda'
    )
    
    op.create_index('idx_queue_items_queue', 'playback_queue_items', ['queue_id'], schema='parranda')
    
    op.create_table('game_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('type', sa.String(length=20), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False, server_default=sa.text("'NOT_STARTED'")),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('rounds_won', sa.Integer(), nullable=False, server_default=sa.text('0')),
        sa.Column('fbj_board_size', sa.Integer(), nullable=True),
        sa.Column('fbj_target_index', sa.Integer(), nullable=True),
        sa.Column('fbj_attempts_remaining', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['parranda.users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        schema='parranda'
    )
    
    op.create_table('ano_viejo_items',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('name', sa.Text(), nullable=False),
        sa.Column('category', sa.Text(), nullable=True),
        sa.Column('image_url', sa.Text(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.PrimaryKeyConstraint('id'),
        schema='parranda'
    )
    
    op.create_table('ano_viejo_applied_items',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('item_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('applied_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['item_id'], ['parranda.ano_viejo_items.id'], ),
        sa.ForeignKeyConstraint(['session_id'], ['parranda.game_sessions.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('session_id', 'item_id', name='ano_viejo_applied_items_session_id_item_id_key'),
        schema='parranda'
    )
    
    op.create_table('user_achievements',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('code', sa.Text(), nullable=False),
        sa.Column('label', sa.Text(), nullable=False),
        sa.Column('unlocked_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['user_id'], ['parranda.users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'code', name='user_achievements_user_id_code_key'),
        schema='parranda'
    )
    
    op.create_table('user_progress_cache',
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('novena_completed', sa.Integer(), nullable=False, server_default=sa.text('0')),
        sa.Column('recipes_uploaded', sa.Integer(), nullable=False, server_default=sa.text('0')),
        sa.Column('photos_shared', sa.Integer(), nullable=False, server_default=sa.text('0')),
        sa.Column('last_updated', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['user_id'], ['parranda.users.id'], ),
        sa.PrimaryKeyConstraint('user_id'),
        schema='parranda'
    )
    
    op.create_index('user_progress_cache_pkey', 'user_progress_cache', ['user_id'], schema='parranda', if_not_exists=True)


def downgrade() -> None:
    # Drop tables
    op.drop_table('user_progress_cache', schema='parranda')
    op.drop_table('user_achievements', schema='parranda')
    op.drop_table('ano_viejo_applied_items', schema='parranda')
    op.drop_table('ano_viejo_items', schema='parranda')
    op.drop_table('game_sessions', schema='parranda')
    op.drop_table('playback_queue_items', schema='parranda')
    op.drop_table('playback_queues', schema='parranda')
    op.drop_table('music_tracks', schema='parranda')
    op.drop_table('recipe_favorites', schema='parranda')
    op.drop_table('recipe_ratings', schema='parranda')
    op.drop_table('recipe_photos', schema='parranda')
    op.drop_table('recipe_ingredients', schema='parranda')
    op.drop_table('recipe_steps', schema='parranda')
    op.drop_table('recipes', schema='parranda')
    op.drop_table('user_novena_progress', schema='parranda')
    op.drop_table('novena_day_sections', schema='parranda')
    op.drop_table('novena_days', schema='parranda')
    op.drop_table('sessions', schema='parranda')
    op.drop_table('users', schema='parranda')
    
    # Drop ENUM types
    op.execute('DROP TYPE IF EXISTS parranda.photo_status')
    op.execute('DROP TYPE IF EXISTS parranda.novena_section_type')
    op.execute('DROP TYPE IF EXISTS parranda.game_status')
    op.execute('DROP TYPE IF EXISTS parranda.game_type')
    
    # Drop schema
    op.execute('DROP SCHEMA IF EXISTS parranda')





