-- Create schema and types for Parranda Navideña
CREATE SCHEMA IF NOT EXISTS parranda;

-- Create ENUM types
DO $$ BEGIN
    CREATE TYPE parranda.game_type AS ENUM ('FIND_BABY_JESUS', 'ANO_VIEJO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE parranda.game_status AS ENUM ('NOT_STARTED', 'PLAYING', 'FINISHED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE parranda.novena_section_type AS ENUM ('ORACIONES', 'GOZOS', 'VILLANCICOS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE parranda.photo_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

