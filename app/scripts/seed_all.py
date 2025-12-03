#!/usr/bin/env python3
"""
Script maestro para poblar la base de datos con datos de prueba.
Ejecutar: docker compose exec app python -m scripts.seed_all
"""

import os
import sys
from pathlib import Path
from uuid import uuid4

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from passlib.context import CryptContext
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from infrastructure.persistence.sqlalchemy.models.user import User
from infrastructure.persistence.sqlalchemy.models.recipe import Recipe, RecipeStep
from infrastructure.persistence.sqlalchemy.models.novena import NovenaDay, NovenaDaySection
from infrastructure.persistence.sqlalchemy.models.music import Song

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://parranda_user:parranda_pass@localhost:5433/parranda",
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ============================================
# DATOS DE USUARIOS
# ============================================
USERS_DATA = [
    {
        "email": "maria@example.com",
        "full_name": "María García",
        "alias": "maria_chef",
        "password": "password123",
    },
    {
        "email": "carlos@example.com",
        "full_name": "Carlos Rodríguez",
        "alias": "carlitos",
        "password": "password123",
    },
    {
        "email": "lucia@example.com",
        "full_name": "Lucía Martínez",
        "alias": "lu_cocina",
        "password": "password123",
    },
    {
        "email": "andres@example.com",
        "full_name": "Andrés López",
        "alias": "andres_navidad",
        "password": "password123",
    },
    {
        "email": "demo@parranda.com",
        "full_name": "Usuario Demo",
        "alias": "demo_user",
        "password": "demo1234",
    },
]


# ============================================
# DATOS DE RECETAS NAVIDEÑAS COLOMBIANAS
# ============================================
RECIPES_DATA = [
    {
        "title": "Natilla Colombiana",
        "category": "postre",
        "prep_time_minutes": 45,
        "yield_amount": "8 porciones",
        "tags": ["navidad", "postre", "tradicional", "colombia"],
        "photo_url": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800",
        "steps": [
            {
                "step_number": 1,
                "instruction_md": "En una olla grande, mezcla la panela rallada con 4 tazas de leche. Cocina a fuego medio hasta que la panela se disuelva completamente.",
                "ingredients_json": [
                    {"name": "Panela", "amount": "250g"},
                    {"name": "Leche", "amount": "4 tazas"},
                ],
                "time_minutes": 10,
            },
            {
                "step_number": 2,
                "instruction_md": "En un recipiente aparte, disuelve la maicena en 2 tazas de leche fría. Asegúrate de que no queden grumos.",
                "ingredients_json": [
                    {"name": "Maicena", "amount": "150g"},
                    {"name": "Leche fría", "amount": "2 tazas"},
                ],
                "time_minutes": 5,
            },
            {
                "step_number": 3,
                "instruction_md": "Agrega la mezcla de maicena a la olla con la leche y panela. Añade la canela, los clavos y las astillas de canela. Revuelve constantemente a fuego medio.",
                "ingredients_json": [
                    {"name": "Canela en polvo", "amount": "1 cucharadita"},
                    {"name": "Clavos de olor", "amount": "4 unidades"},
                    {"name": "Astillas de canela", "amount": "2 unidades"},
                ],
                "time_minutes": 15,
            },
            {
                "step_number": 4,
                "instruction_md": "Cuando la mezcla espese y se despegue de los bordes de la olla, retira del fuego. Vierte en moldes y deja enfriar. Refrigera por al menos 4 horas antes de servir.",
                "ingredients_json": [],
                "time_minutes": 15,
            },
        ],
    },
    {
        "title": "Buñuelos Colombianos",
        "category": "postre",
        "prep_time_minutes": 60,
        "yield_amount": "30 buñuelos",
        "tags": ["navidad", "postre", "frito", "colombia"],
        "photo_url": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800",
        "steps": [
            {
                "step_number": 1,
                "instruction_md": "Mezcla el queso costeño rallado con la fécula de maíz y la sal en un recipiente grande. Añade los huevos uno a uno, mezclando bien después de cada adición.",
                "ingredients_json": [
                    {"name": "Queso costeño", "amount": "500g"},
                    {"name": "Fécula de maíz", "amount": "200g"},
                    {"name": "Huevos", "amount": "2 unidades"},
                    {"name": "Sal", "amount": "1/2 cucharadita"},
                ],
                "time_minutes": 15,
            },
            {
                "step_number": 2,
                "instruction_md": "Amasa hasta obtener una masa suave y homogénea. Si la masa está muy seca, añade un poco de leche. Forma bolitas del tamaño de una nuez.",
                "ingredients_json": [
                    {"name": "Leche", "amount": "2-3 cucharadas (si es necesario)"},
                ],
                "time_minutes": 15,
            },
            {
                "step_number": 3,
                "instruction_md": "Calienta abundante aceite a 160°C. Fríe los buñuelos en tandas pequeñas, moviéndolos constantemente para que doren parejo. Deben quedar dorados y huecos por dentro.",
                "ingredients_json": [
                    {"name": "Aceite para freír", "amount": "Suficiente para cubrir"},
                ],
                "time_minutes": 30,
            },
        ],
    },
    {
        "title": "Lechona Tolimense",
        "category": "plato principal",
        "prep_time_minutes": 480,
        "yield_amount": "20 porciones",
        "tags": ["navidad", "cerdo", "tradicional", "tolima"],
        "photo_url": "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800",
        "steps": [
            {
                "step_number": 1,
                "instruction_md": "El día anterior: limpia bien el cerdo por dentro y por fuera. Sazona generosamente con sal, comino, ajo y cebolla. Refrigera durante la noche.",
                "ingredients_json": [
                    {"name": "Cerdo entero", "amount": "10-12 kg"},
                    {"name": "Sal", "amount": "Al gusto"},
                    {"name": "Comino", "amount": "3 cucharadas"},
                    {"name": "Ajo", "amount": "2 cabezas"},
                    {"name": "Cebolla", "amount": "4 unidades grandes"},
                ],
                "time_minutes": 60,
            },
            {
                "step_number": 2,
                "instruction_md": "Cocina los arvejos hasta que estén tiernos. Reserva. Cocina el arroz en caldo de cerdo hasta que esté al dente. Mezcla con los arvejos.",
                "ingredients_json": [
                    {"name": "Arvejos secos", "amount": "2 kg"},
                    {"name": "Arroz", "amount": "3 kg"},
                    {"name": "Caldo de cerdo", "amount": "Suficiente"},
                ],
                "time_minutes": 90,
            },
            {
                "step_number": 3,
                "instruction_md": "Rellena el cerdo con la mezcla de arroz y arvejos. Cierra con hilo de cocina. Hornea a 180°C durante 6-8 horas, bañando regularmente con los jugos.",
                "ingredients_json": [],
                "time_minutes": 420,
            },
        ],
    },
    {
        "title": "Tamales Vallunos",
        "category": "plato principal",
        "prep_time_minutes": 300,
        "yield_amount": "25 tamales",
        "tags": ["navidad", "tradicional", "valle"],
        "photo_url": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800",
        "steps": [
            {
                "step_number": 1,
                "instruction_md": "Cocina el cerdo y el pollo por separado hasta que estén tiernos. Reserva el caldo. Deshilacha las carnes y sazona con hogao.",
                "ingredients_json": [
                    {"name": "Cerdo", "amount": "1.5 kg"},
                    {"name": "Pollo", "amount": "1 kg"},
                    {"name": "Hogao", "amount": "2 tazas"},
                ],
                "time_minutes": 90,
            },
            {
                "step_number": 2,
                "instruction_md": "Prepara la masa mezclando la harina de maíz con el caldo tibio. Añade manteca de cerdo, color y sal. Amasa hasta obtener una consistencia suave.",
                "ingredients_json": [
                    {"name": "Harina de maíz", "amount": "2 kg"},
                    {"name": "Caldo tibio", "amount": "6 tazas"},
                    {"name": "Manteca de cerdo", "amount": "300g"},
                    {"name": "Color (achiote)", "amount": "2 cucharadas"},
                    {"name": "Sal", "amount": "Al gusto"},
                ],
                "time_minutes": 30,
            },
            {
                "step_number": 3,
                "instruction_md": "En cada hoja de plátano, pon una porción de masa, carnes, papa, zanahoria, huevo y garbanzo. Envuelve y amarra bien.",
                "ingredients_json": [
                    {"name": "Hojas de plátano", "amount": "25 hojas"},
                    {"name": "Papa", "amount": "5 unidades"},
                    {"name": "Zanahoria", "amount": "3 unidades"},
                    {"name": "Huevos cocidos", "amount": "5 unidades"},
                    {"name": "Garbanzos", "amount": "1 taza"},
                ],
                "time_minutes": 60,
            },
            {
                "step_number": 4,
                "instruction_md": "Cocina los tamales en agua hirviendo durante 2-3 horas. Están listos cuando la masa se despega fácilmente de la hoja.",
                "ingredients_json": [],
                "time_minutes": 180,
            },
        ],
    },
    {
        "title": "Hojuelas de Navidad",
        "category": "postre",
        "prep_time_minutes": 45,
        "yield_amount": "40 hojuelas",
        "tags": ["navidad", "postre", "frito"],
        "photo_url": "https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=800",
        "steps": [
            {
                "step_number": 1,
                "instruction_md": "Mezcla la harina con el polvo de hornear y la sal. Haz un hueco en el centro y añade los huevos, la mantequilla derretida y el aguardiente.",
                "ingredients_json": [
                    {"name": "Harina de trigo", "amount": "500g"},
                    {"name": "Polvo de hornear", "amount": "1 cucharadita"},
                    {"name": "Sal", "amount": "1/4 cucharadita"},
                    {"name": "Huevos", "amount": "3 unidades"},
                    {"name": "Mantequilla derretida", "amount": "50g"},
                    {"name": "Aguardiente", "amount": "2 cucharadas"},
                ],
                "time_minutes": 15,
            },
            {
                "step_number": 2,
                "instruction_md": "Amasa hasta obtener una masa elástica. Deja reposar 30 minutos. Estira la masa muy fina y corta en rectángulos con cortes en el centro.",
                "ingredients_json": [],
                "time_minutes": 15,
            },
            {
                "step_number": 3,
                "instruction_md": "Fríe en aceite caliente hasta que estén doradas y crujientes. Escurre y espolvorea generosamente con azúcar glass mientras están calientes.",
                "ingredients_json": [
                    {"name": "Aceite para freír", "amount": "Suficiente"},
                    {"name": "Azúcar glass", "amount": "200g"},
                ],
                "time_minutes": 15,
            },
        ],
    },
    {
        "title": "Sabajón Navideño",
        "category": "bebida",
        "prep_time_minutes": 30,
        "yield_amount": "12 porciones",
        "tags": ["navidad", "bebida", "licor"],
        "photo_url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800",
        "steps": [
            {
                "step_number": 1,
                "instruction_md": "Separa las yemas de los huevos. Bate las yemas con el azúcar hasta que estén pálidas y espumosas (aproximadamente 5 minutos).",
                "ingredients_json": [
                    {"name": "Yemas de huevo", "amount": "8 unidades"},
                    {"name": "Azúcar", "amount": "200g"},
                ],
                "time_minutes": 10,
            },
            {
                "step_number": 2,
                "instruction_md": "En una olla, calienta la leche condensada con la leche evaporada a fuego bajo. Añade la canela y la nuez moscada. No dejes hervir.",
                "ingredients_json": [
                    {"name": "Leche condensada", "amount": "400g"},
                    {"name": "Leche evaporada", "amount": "400ml"},
                    {"name": "Canela", "amount": "1 astilla"},
                    {"name": "Nuez moscada", "amount": "1/4 cucharadita"},
                ],
                "time_minutes": 10,
            },
            {
                "step_number": 3,
                "instruction_md": "Incorpora las yemas batidas a la mezcla de leche, revolviendo constantemente. Cocina hasta que espese ligeramente. Retira del fuego y añade el ron. Embotella y refrigera.",
                "ingredients_json": [
                    {"name": "Ron añejo", "amount": "250ml"},
                ],
                "time_minutes": 10,
            },
        ],
    },
    {
        "title": "Manjar Blanco",
        "category": "postre",
        "prep_time_minutes": 120,
        "yield_amount": "6 porciones",
        "tags": ["navidad", "postre", "valle", "dulce"],
        "photo_url": "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800",
        "steps": [
            {
                "step_number": 1,
                "instruction_md": "Vierte la leche fresca en una olla grande de fondo grueso. Añade el azúcar y la astilla de canela. Cocina a fuego medio, revolviendo ocasionalmente.",
                "ingredients_json": [
                    {"name": "Leche fresca", "amount": "3 litros"},
                    {"name": "Azúcar", "amount": "750g"},
                    {"name": "Canela en astilla", "amount": "1 unidad"},
                ],
                "time_minutes": 10,
            },
            {
                "step_number": 2,
                "instruction_md": "Cuando empiece a hervir, reduce el fuego y continúa revolviendo constantemente con una cuchara de madera. Este proceso toma aproximadamente 2 horas.",
                "ingredients_json": [],
                "time_minutes": 90,
            },
            {
                "step_number": 3,
                "instruction_md": "El manjar está listo cuando al pasar la cuchara se ve el fondo de la olla y tiene un color dorado. Retira la canela, vierte en un molde y deja enfriar.",
                "ingredients_json": [],
                "time_minutes": 20,
            },
        ],
    },
    {
        "title": "Empanadas de Pipián",
        "category": "entrada",
        "prep_time_minutes": 90,
        "yield_amount": "20 empanadas",
        "tags": ["navidad", "cauca", "tradicional"],
        "photo_url": "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=800",
        "steps": [
            {
                "step_number": 1,
                "instruction_md": "Para el pipián: tuesta el maní y licúa con un poco de agua. Cocina las papas y machácalas. Mezcla con el maní, hogao, huevo duro picado y comino.",
                "ingredients_json": [
                    {"name": "Maní", "amount": "200g"},
                    {"name": "Papa", "amount": "500g"},
                    {"name": "Hogao", "amount": "1 taza"},
                    {"name": "Huevo duro", "amount": "2 unidades"},
                    {"name": "Comino", "amount": "1/2 cucharadita"},
                ],
                "time_minutes": 30,
            },
            {
                "step_number": 2,
                "instruction_md": "Prepara la masa mezclando la harina de maíz con agua tibia y sal. Amasa bien y deja reposar 15 minutos.",
                "ingredients_json": [
                    {"name": "Harina de maíz", "amount": "500g"},
                    {"name": "Agua tibia", "amount": "2 tazas"},
                    {"name": "Sal", "amount": "1 cucharadita"},
                ],
                "time_minutes": 20,
            },
            {
                "step_number": 3,
                "instruction_md": "Forma bolitas de masa, aplana y rellena con el pipián. Cierra formando media luna. Fríe en aceite caliente hasta dorar.",
                "ingredients_json": [
                    {"name": "Aceite para freír", "amount": "Suficiente"},
                ],
                "time_minutes": 40,
            },
        ],
    },
]


def seed_users(session):
    """Seed test users."""
    print("\n👥 Seeding users...")
    
    existing = session.query(User).filter(
        User.email.in_([u["email"] for u in USERS_DATA])
    ).count()
    
    if existing > 0:
        print(f"   ⚠️  Already have {existing} test users. Skipping.")
        return []
    
    users = []
    for user_data in USERS_DATA:
        user = User(
            id=uuid4(),
            email=user_data["email"],
            full_name=user_data["full_name"],
            alias=user_data["alias"],
            password_hash=pwd_context.hash(user_data["password"]),
            is_active=True,
        )
        session.add(user)
        users.append(user)
        print(f"   ✅ {user_data['full_name']} ({user_data['email']})")
    
    session.flush()
    print(f"   📊 Created {len(users)} users")
    return users


def seed_recipes(session, users):
    """Seed recipes."""
    print("\n🍽️  Seeding recipes...")
    
    existing = session.query(Recipe).count()
    if existing > 0:
        print(f"   ⚠️  Already have {existing} recipes. Skipping.")
        return
    
    if not users:
        users = session.query(User).limit(4).all()
        if not users:
            print("   ❌ No users available to assign as authors")
            return
    
    for i, recipe_data in enumerate(RECIPES_DATA):
        author = users[i % len(users)]
        
        recipe = Recipe(
            id=uuid4(),
            title=recipe_data["title"],
            author_user_id=author.id,
            author_alias=author.alias or author.full_name,
            photo_url=recipe_data.get("photo_url"),
            prep_time_minutes=recipe_data["prep_time_minutes"],
            yield_amount=recipe_data["yield_amount"],
            category=recipe_data["category"],
            tags=recipe_data["tags"],
            is_published=True,
            is_community=True,
        )
        session.add(recipe)
        session.flush()
        
        print(f"   📖 {recipe_data['title']}")
        
        for step_data in recipe_data["steps"]:
            step = RecipeStep(
                id=uuid4(),
                recipe_id=recipe.id,
                step_number=step_data["step_number"],
                instruction_md=step_data["instruction_md"],
                ingredients_json=step_data["ingredients_json"],
                time_minutes=step_data.get("time_minutes"),
            )
            session.add(step)
    
    print(f"   📊 Created {len(RECIPES_DATA)} recipes")


def seed_novenas(session):
    """Seed novena data (imported from seed_novenas.py)."""
    print("\n🕯️  Seeding novenas...")
    
    from scripts.seed_novenas import NOVENA_DAYS
    
    existing = session.query(NovenaDay).count()
    if existing > 0:
        print(f"   ⚠️  Already have {existing} novena days. Skipping.")
        return
    
    for day_data in NOVENA_DAYS:
        day = NovenaDay(
            day_number=day_data["day_number"],
            title=day_data["title"],
        )
        session.add(day)
        session.flush()
        
        print(f"   📅 Day {day_data['day_number']}: {day_data['title']}")
        
        for section_data in day_data["sections"]:
            section = NovenaDaySection(
                day_id=day.id,
                section_type=section_data["type"],
                position=section_data["position"],
                content_md=section_data["content"],
            )
            session.add(section)
    
    print(f"   📊 Created {len(NOVENA_DAYS)} novena days")


def seed_songs(session):
    """Seed songs data (imported from seed_songs.py)."""
    print("\n🎵 Seeding songs...")
    
    from scripts.seed_songs import SONGS_DATA
    
    existing = session.query(Song).count()
    if existing > 0:
        print(f"   ⚠️  Already have {existing} songs. Skipping.")
        return
    
    for song_data in SONGS_DATA:
        song = Song(
            id=uuid4(),
            youtube_video_id=song_data["youtube_id"],
            title=song_data["title"],
            artist=song_data["artist"],
            thumbnail_url=f"https://i.ytimg.com/vi/{song_data['youtube_id']}/mqdefault.jpg",
            duration_seconds=song_data["duration"],
            genre=song_data["genre"],
            is_christmas=True,
        )
        session.add(song)
    
    print(f"   📊 Created {len(SONGS_DATA)} songs")


def main():
    """Run all seeds."""
    print("=" * 60)
    print("🎄 PARRANDA NAVIDEÑA - Database Seeder")
    print("=" * 60)
    
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Seed in order
        users = seed_users(session)
        seed_recipes(session, users)
        seed_novenas(session)
        seed_songs(session)
        
        session.commit()
        
        print("\n" + "=" * 60)
        print("✅ Database seeded successfully!")
        print("=" * 60)
        print("\n📋 Summary:")
        print(f"   👥 Users: {session.query(User).count()}")
        print(f"   🍽️  Recipes: {session.query(Recipe).count()}")
        print(f"   🕯️  Novena Days: {session.query(NovenaDay).count()}")
        print(f"   🎵 Songs: {session.query(Song).count()}")
        print("\n🔐 Test credentials:")
        print("   Email: demo@parranda.com")
        print("   Password: demo1234")
        print("=" * 60)
        
    except Exception as e:
        session.rollback()
        print(f"\n❌ Error seeding database: {e}")
        raise
    finally:
        session.close()


if __name__ == "__main__":
    main()

