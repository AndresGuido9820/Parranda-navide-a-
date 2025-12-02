# Esquema de Base de Datos - Parranda Navideña

## Diagrama de Entidades

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USUARIOS Y AUTENTICACIÓN                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐         ┌─────────────────────┐                           │
│  │   users     │ 1────n  │     sessions        │                           │
│  ├─────────────┤         ├─────────────────────┤                           │
│  │ id (PK)     │         │ id (PK)             │                           │
│  │ email       │         │ user_id (FK)        │                           │
│  │ full_name   │         │ session_token_hash  │                           │
│  │ alias       │         │ expires_at          │                           │
│  │ phone       │         │ user_agent          │                           │
│  │ avatar_url  │         │ ip_address          │                           │
│  │ password    │         │ created_at          │                           │
│  │ is_active   │         └─────────────────────┘                           │
│  │ created_at  │                                                            │
│  │ updated_at  │                                                            │
│  └─────────────┘                                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                 NOVENAS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────┐    1─n    ┌─────────────────────┐                       │
│  │  novena_days  │ ─────────→│ novena_day_sections │                       │
│  ├───────────────┤           ├─────────────────────┤                       │
│  │ id (PK)       │           │ id (PK)             │                       │
│  │ day_number    │           │ day_id (FK)         │                       │
│  │ title         │           │ section_type        │                       │
│  │ created_at    │           │ position            │                       │
│  └───────────────┘           │ content_md          │                       │
│        │                     └─────────────────────┘                       │
│        │                                                                    │
│        │ 1─n   ┌─────────────────────────┐                                 │
│        └──────→│ user_novena_progress    │                                 │
│                ├─────────────────────────┤                                 │
│  users 1─n────→│ user_id (PK, FK)        │                                 │
│                │ day_id (PK, FK)         │                                 │
│                │ is_completed            │                                 │
│                │ completed_at            │                                 │
│                │ last_read_at            │                                 │
│                └─────────────────────────┘                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                 RECETAS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    1─n    ┌─────────────────┐                         │
│  │    recipes      │ ─────────→│  recipe_steps   │                         │
│  ├─────────────────┤           ├─────────────────┤                         │
│  │ id (PK)         │           │ id (PK)         │                         │
│  │ title           │           │ recipe_id (FK)  │                         │
│  │ author_user_id  │           │ step_number     │                         │
│  │ author_alias    │           │ instruction_md  │                         │
│  │ photo_url       │           │ ingredients_json│                         │
│  │ prep_time_min   │           │ time_minutes    │                         │
│  │ yield           │           └─────────────────┘                         │
│  │ category        │                                                        │
│  │ rating          │    1─n    ┌─────────────────┐                         │
│  │ tags[]          │ ─────────→│ recipe_ratings  │                         │
│  │ is_published    │           ├─────────────────┤                         │
│  │ is_community    │           │ id (PK)         │                         │
│  │ created_at      │           │ user_id (FK)    │                         │
│  │ updated_at      │           │ recipe_id (FK)  │                         │
│  └─────────────────┘           │ rating (1-5)    │                         │
│        │                       │ created_at      │                         │
│        │                       └─────────────────┘                         │
│        │                                                                    │
│        │ n─n   ┌─────────────────────────┐                                 │
│        └──────→│ user_favorite_recipes   │                                 │
│                ├─────────────────────────┤                                 │
│  users n─n────→│ user_id (PK, FK)        │                                 │
│                │ recipe_id (PK, FK)      │                                 │
│                │ created_at              │                                 │
│                └─────────────────────────┘                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                 MÚSICA                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐         ┌─────────────────┐                           │
│  │     songs       │         │    playlists    │                           │
│  ├─────────────────┤         ├─────────────────┤                           │
│  │ id (PK)         │         │ id (PK)         │                           │
│  │ youtube_video_id│         │ user_id (FK)    │←──── users                │
│  │ title           │         │ name            │                           │
│  │ artist          │         │ description     │                           │
│  │ thumbnail_url   │         │ is_public       │                           │
│  │ duration_sec    │         │ created_at      │                           │
│  │ genre           │         │ updated_at      │                           │
│  │ is_christmas    │         └─────────────────┘                           │
│  │ is_active       │               │                                        │
│  │ created_at      │               │ 1─n                                   │
│  └─────────────────┘               ↓                                        │
│        │               ┌─────────────────────┐                             │
│        │ n─n           │   playlist_songs    │                             │
│        └──────────────→├─────────────────────┤                             │
│                        │ playlist_id (PK,FK) │                             │
│                        │ song_id (PK, FK)    │                             │
│                        │ position            │                             │
│                        │ added_at            │                             │
│                        └─────────────────────┘                             │
│                                                                             │
│        │ n─n   ┌─────────────────────────┐                                 │
│        └──────→│  user_favorite_songs    │                                 │
│                ├─────────────────────────┤                                 │
│  users n─n────→│ user_id (PK, FK)        │                                 │
│                │ song_id (PK, FK)        │                                 │
│                │ created_at              │                                 │
│                └─────────────────────────┘                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              DINÁMICAS / JUEGOS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐         ┌─────────────────────┐                   │
│  │  user_game_stats    │         │  ano_viejo_configs  │                   │
│  ├─────────────────────┤         ├─────────────────────┤                   │
│  │ id (PK)             │         │ id (PK)             │                   │
│  │ user_id (FK)        │         │ user_id (FK)        │                   │
│  │ game_type           │         │ name                │                   │
│  │ games_played        │         │ config_json         │                   │
│  │ games_won           │         │ is_burned           │                   │
│  │ best_score          │         │ burned_at           │                   │
│  │ total_score         │         │ created_at          │                   │
│  │ last_played_at      │         └─────────────────────┘                   │
│  │ created_at          │                                                    │
│  │ updated_at          │                                                    │
│  └─────────────────────┘                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Tablas

### Usuarios y Autenticación

| Tabla | Descripción |
|-------|-------------|
| `users` | Usuarios registrados |
| `sessions` | Sesiones activas |

### Novenas

| Tabla | Descripción |
|-------|-------------|
| `novena_days` | Días de la novena (1-9) |
| `novena_day_sections` | Secciones de cada día (oraciones, gozos, etc.) |
| `user_novena_progress` | Progreso del usuario en novenas |

### Recetas

| Tabla | Descripción |
|-------|-------------|
| `recipes` | Recetas navideñas |
| `recipe_steps` | Pasos de cada receta |
| `recipe_ratings` | Valoraciones de recetas |
| `user_favorite_recipes` | Recetas favoritas |

### Música

| Tabla | Descripción |
|-------|-------------|
| `songs` | Biblioteca de canciones |
| `playlists` | Playlists de usuarios |
| `playlist_songs` | Canciones en playlists |
| `user_favorite_songs` | Canciones favoritas |

### Juegos/Dinámicas

| Tabla | Descripción |
|-------|-------------|
| `user_game_stats` | Estadísticas de juegos |
| `ano_viejo_configs` | Configuraciones del muñeco de año viejo |

## Migraciones

Las migraciones se manejan con Alembic. Para aplicar:

```bash
cd app
alembic upgrade head
```

Para crear una nueva migración:

```bash
alembic revision --autogenerate -m "descripcion"
```

## Categorías de Recetas

- `platos` - Platos principales
- `postres` - Postres y dulces
- `bebidas` - Bebidas
- `aperitivos` - Aperitivos
- `acompañamientos` - Acompañamientos

## Géneros Musicales

- `villancico` - Villancicos tradicionales
- `vallenato` - Música vallenata
- `salsa` - Salsa
- `tropical` - Música tropical
- `pop` - Pop navideño
- `rap` - Rap/Hip-hop
- `tradicional` - Música tradicional
- `infantil` - Canciones infantiles
- `internacional` - Música internacional

## Tipos de Juegos

- `nino_dios` - Encontrar al Niño Dios
- `ano_viejo` - Vestir y quemar el Año Viejo

