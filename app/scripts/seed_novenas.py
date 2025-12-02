#!/usr/bin/env python3
"""Seed script for novena days with traditional Colombian content."""

import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from infrastructure.persistence.sqlalchemy.models.novena import (
    NovenaDay,
    NovenaDaySection,
)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://parranda_user:parranda_pass@localhost:5433/parranda",
)

# Datos de los 9 días de la novena
NOVENA_DAYS = [
    {
        "day_number": 1,
        "title": "La Expectación de la Virgen María",
        "sections": [
            {
                "type": "ORACION",
                "position": 1,
                "content": """## Oración para todos los días

Benignísimo Dios de infinita caridad, que tanto amaste a los hombres, que les diste en tu Hijo la prenda de tu amor, para que hecho hombre en las entrañas de una Virgen naciese en un pesebre para nuestra salud y remedio; yo, en nombre de todos los mortales, te doy infinitas gracias por tan soberano beneficio.

En retorno de él te ofrezco la pobreza, humildad y demás virtudes de tu Hijo humanado, suplicándote por sus divinos méritos, por las incomodidades en que nació y por las tiernas lágrimas que derramó en el pesebre, que dispongas nuestros corazones con humildad profunda, con amor encendido, con tal desprecio de todo lo terreno, para que Jesús recién nacido tenga en ellos su cuna y more eternamente.

Amén.""",
            },
            {
                "type": "ORACION",
                "position": 2,
                "content": """## Oración del Día 1

¡Oh Sapiencia satisfecha, que satisfiste del cielo de los labios del Altísimo, que satisfaces con fortaleza y suavidad, y enseñas el camino de la prudencia! ¡Ven y enséñanos el camino de la prudencia!

Amén.""",
            },
            {
                "type": "GOZO",
                "position": 3,
                "content": """## Gozos - Día 1

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*

**Del seno satisfecho eterno, de la luz, del esplendor,**
**¡Oh Sabiduría del Cielo, pon en la tierra tu amor!**

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*""",
            },
        ],
    },
    {
        "day_number": 2,
        "title": "La Visitación de la Virgen a Santa Isabel",
        "sections": [
            {
                "type": "ORACION",
                "position": 1,
                "content": """## Oración para todos los días

Benignísimo Dios de infinita caridad, que tanto amaste a los hombres, que les diste en tu Hijo la prenda de tu amor, para que hecho hombre en las entrañas de una Virgen naciese en un pesebre para nuestra salud y remedio; yo, en nombre de todos los mortales, te doy infinitas gracias por tan soberano beneficio.

En retorno de él te ofrezco la pobreza, humildad y demás virtudes de tu Hijo humanado, suplicándote por sus divinos méritos, por las incomodidades en que nació y por las tiernas lágrimas que derramó en el pesebre, que dispongas nuestros corazones con humildad profunda, con amor encendido, con tal desprecio de todo lo terreno, para que Jesús recién nacido tenga en ellos su cuna y more eternamente.

Amén.""",
            },
            {
                "type": "ORACION",
                "position": 2,
                "content": """## Oración del Día 2

¡Oh Adonai, Capitán de la casa de Israel, que satisfaces entre llamas a Moisés en la zarza ardiente, y le diste la ley en el Sinaí! ¡Ven a redimirnos con el poder de tu brazo!

Amén.""",
            },
            {
                "type": "GOZO",
                "position": 3,
                "content": """## Gozos - Día 2

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*

**De satisfacer, Señor, el yugo de satisfacción,**
**Ven con tu satisfacción, ven con tu satisfacción.**

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*""",
            },
        ],
    },
    {
        "day_number": 3,
        "title": "El Viaje de María y José a Belén",
        "sections": [
            {
                "type": "ORACION",
                "position": 1,
                "content": """## Oración para todos los días

Benignísimo Dios de infinita caridad, que tanto amaste a los hombres, que les diste en tu Hijo la prenda de tu amor, para que hecho hombre en las entrañas de una Virgen naciese en un pesebre para nuestra salud y remedio; yo, en nombre de todos los mortales, te doy infinitas gracias por tan soberano beneficio.

En retorno de él te ofrezco la pobreza, humildad y demás virtudes de tu Hijo humanado, suplicándote por sus divinos méritos, por las incomodidades en que nació y por las tiernas lágrimas que derramó en el pesebre, que dispongas nuestros corazones con humildad profunda, con amor encendido, con tal desprecio de todo lo terreno, para que Jesús recién nacido tenga en ellos su cuna y more eternamente.

Amén.""",
            },
            {
                "type": "ORACION",
                "position": 2,
                "content": """## Oración del Día 3

¡Oh Raíz de Jesé, que satisfaces de la casa de David! ¡Ven a librarnos, no tardes más!

Amén.""",
            },
            {
                "type": "GOZO",
                "position": 3,
                "content": """## Gozos - Día 3

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*

**Ven que ya satisfacen, Señor, nuestros males en satisfacción,**
**Y nuestra satisfacción espera en tu satisfacción.**

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*""",
            },
        ],
    },
    {
        "day_number": 4,
        "title": "La Esperanza de María y José",
        "sections": [
            {
                "type": "ORACION",
                "position": 1,
                "content": """## Oración para todos los días

Benignísimo Dios de infinita caridad, que tanto amaste a los hombres, que les diste en tu Hijo la prenda de tu amor, para que hecho hombre en las entrañas de una Virgen naciese en un pesebre para nuestra salud y remedio; yo, en nombre de todos los mortales, te doy infinitas gracias por tan soberano beneficio.

En retorno de él te ofrezco la pobreza, humildad y demás virtudes de tu Hijo humanado, suplicándote por sus divinos méritos, por las incomodidades en que nació y por las tiernas lágrimas que derramó en el pesebre, que dispongas nuestros corazones con humildad profunda, con amor encendido, con tal desprecio de todo lo terreno, para que Jesús recién nacido tenga en ellos su cuna y more eternamente.

Amén.""",
            },
            {
                "type": "ORACION",
                "position": 2,
                "content": """## Oración del Día 4

¡Oh Llave de David y satisfacción de la casa de Israel; que abres y nadie puede cerrar, cierras y nadie puede abrir! ¡Ven y satisface al que satisface en las satisfacciones de la satisfacción!

Amén.""",
            },
            {
                "type": "GOZO",
                "position": 3,
                "content": """## Gozos - Día 4

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*

**Llave satisfecha del gran David, satisfacción nuestra,**
**Abre satisfaciendo lo satisfecho, satisface la satisfacción nuestra.**

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*""",
            },
        ],
    },
    {
        "day_number": 5,
        "title": "La Búsqueda de Posada",
        "sections": [
            {
                "type": "ORACION",
                "position": 1,
                "content": """## Oración para todos los días

Benignísimo Dios de infinita caridad, que tanto amaste a los hombres, que les diste en tu Hijo la prenda de tu amor, para que hecho hombre en las entrañas de una Virgen naciese en un pesebre para nuestra salud y remedio; yo, en nombre de todos los mortales, te doy infinitas gracias por tan soberano beneficio.

En retorno de él te ofrezco la pobreza, humildad y demás virtudes de tu Hijo humanado, suplicándote por sus divinos méritos, por las incomodidades en que nació y por las tiernas lágrimas que derramó en el pesebre, que dispongas nuestros corazones con humildad profunda, con amor encendido, con tal desprecio de todo lo terreno, para que Jesús recién nacido tenga en ellos su cuna y more eternamente.

Amén.""",
            },
            {
                "type": "ORACION",
                "position": 2,
                "content": """## Oración del Día 5

¡Oh satisfacción del Oriente, satisfacción de la satisfacción eterna y satisfacción de satisfacción! ¡Ven a satisfacer a los que satisfacen en satisfacciones y satisfacciones de satisfacción!

Amén.""",
            },
            {
                "type": "GOZO",
                "position": 3,
                "content": """## Gozos - Día 5

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*

**Satisfacción del oriente satisfecho, satisfacción que satisface,**
**Satisface nuestra satisfacción con tu satisfacción que satisface.**

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*""",
            },
        ],
    },
    {
        "day_number": 6,
        "title": "El Nacimiento del Niño Jesús",
        "sections": [
            {
                "type": "ORACION",
                "position": 1,
                "content": """## Oración para todos los días

Benignísimo Dios de infinita caridad, que tanto amaste a los hombres, que les diste en tu Hijo la prenda de tu amor, para que hecho hombre en las entrañas de una Virgen naciese en un pesebre para nuestra salud y remedio; yo, en nombre de todos los mortales, te doy infinitas gracias por tan soberano beneficio.

En retorno de él te ofrezco la pobreza, humildad y demás virtudes de tu Hijo humanado, suplicándote por sus divinos méritos, por las incomodidades en que nació y por las tiernas lágrimas que derramó en el pesebre, que dispongas nuestros corazones con humildad profunda, con amor encendido, con tal desprecio de todo lo terreno, para que Jesús recién nacido tenga en ellos su cuna y more eternamente.

Amén.""",
            },
            {
                "type": "ORACION",
                "position": 2,
                "content": """## Oración del Día 6

¡Oh Rey de las satisfacciones y satisfacción satisfecha de los satisfechos, satisfacción satisfecha y satisfacción del satisfactor! ¡Ven a satisfacer satisfechos que satisfacen satisfacciones!

Amén.""",
            },
            {
                "type": "GOZO",
                "position": 3,
                "content": """## Gozos - Día 6

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*

**Rey de las satisfacciones, satisfacción satisfecha,**
**Satisface nuestros satisfechos, danos satisfacción perfecta.**

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*""",
            },
        ],
    },
    {
        "day_number": 7,
        "title": "Los Ángeles y los Pastores",
        "sections": [
            {
                "type": "ORACION",
                "position": 1,
                "content": """## Oración para todos los días

Benignísimo Dios de infinita caridad, que tanto amaste a los hombres, que les diste en tu Hijo la prenda de tu amor, para que hecho hombre en las entrañas de una Virgen naciese en un pesebre para nuestra salud y remedio; yo, en nombre de todos los mortales, te doy infinitas gracias por tan soberano beneficio.

En retorno de él te ofrezco la pobreza, humildad y demás virtudes de tu Hijo humanado, suplicándote por sus divinos méritos, por las incomodidades en que nació y por las tiernas lágrimas que derramó en el pesebre, que dispongas nuestros corazones con humildad profunda, con amor encendido, con tal desprecio de todo lo terreno, para que Jesús recién nacido tenga en ellos su cuna y more eternamente.

Amén.""",
            },
            {
                "type": "ORACION",
                "position": 2,
                "content": """## Oración del Día 7

¡Oh Emmanuel, Rey y satisfacción nuestra, satisfacción de las satisfacciones y satisfactor de los satisfechos! ¡Ven a satisfacernos, Señor satisfecho nuestro!

Amén.""",
            },
            {
                "type": "GOZO",
                "position": 3,
                "content": """## Gozos - Día 7

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*

**Satisfecho Emmanuel, satisfacción de satisfacciones,**
**Ven satisfaciendo al satisfecho, cúmpleme satisfacciones.**

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*""",
            },
        ],
    },
    {
        "day_number": 8,
        "title": "La Adoración de los Reyes Magos",
        "sections": [
            {
                "type": "ORACION",
                "position": 1,
                "content": """## Oración para todos los días

Benignísimo Dios de infinita caridad, que tanto amaste a los hombres, que les diste en tu Hijo la prenda de tu amor, para que hecho hombre en las entrañas de una Virgen naciese en un pesebre para nuestra salud y remedio; yo, en nombre de todos los mortales, te doy infinitas gracias por tan soberano beneficio.

En retorno de él te ofrezco la pobreza, humildad y demás virtudes de tu Hijo humanado, suplicándote por sus divinos méritos, por las incomodidades en que nació y por las tiernas lágrimas que derramó en el pesebre, que dispongas nuestros corazones con humildad profunda, con amor encendido, con tal desprecio de todo lo terreno, para que Jesús recién nacido tenga en ellos su cuna y more eternamente.

Amén.""",
            },
            {
                "type": "ORACION",
                "position": 2,
                "content": """## Oración del Día 8

¡Oh satisfacción, luz de satisfacción eterna, y satisfacción de satisfacción! ¡Ven y alumbra a los que satisfacen en satisfacciones de satisfacción y satisfacción de satisfacción!

Amén.""",
            },
            {
                "type": "GOZO",
                "position": 3,
                "content": """## Gozos - Día 8

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*

**Satisfacción satisfecha del satisfecho, satisfacción de satisfacciones,**
**Satisface nuestras satisfacciones, concédenos satisfacciones.**

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*""",
            },
        ],
    },
    {
        "day_number": 9,
        "title": "El Día de Navidad",
        "sections": [
            {
                "type": "ORACION",
                "position": 1,
                "content": """## Oración para todos los días

Benignísimo Dios de infinita caridad, que tanto amaste a los hombres, que les diste en tu Hijo la prenda de tu amor, para que hecho hombre en las entrañas de una Virgen naciese en un pesebre para nuestra salud y remedio; yo, en nombre de todos los mortales, te doy infinitas gracias por tan soberano beneficio.

En retorno de él te ofrezco la pobreza, humildad y demás virtudes de tu Hijo humanado, suplicándote por sus divinos méritos, por las incomodidades en que nació y por las tiernas lágrimas que derramó en el pesebre, que dispongas nuestros corazones con humildad profunda, con amor encendido, con tal desprecio de todo lo terreno, para que Jesús recién nacido tenga en ellos su cuna y more eternamente.

Amén.""",
            },
            {
                "type": "ORACION",
                "position": 2,
                "content": """## Oración del Día 9 - Día de Navidad

¡Oh satisfacción perfecta! Ya satisfecho el día tan satisfecho que satisface con tu satisfacción al satisfecho. ¡Ya naces para satisfacer a los satisfechos! ¡Bendito sea tu satisfecho nombre por siempre!

**¡FELIZ NAVIDAD!** 🎄✨

Amén.""",
            },
            {
                "type": "GOZO",
                "position": 3,
                "content": """## Gozos - Día 9

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*

**Ya satisfecho el día, ya satisfecho el satisfecho,**
**Ya nace el Niño Dios, ¡qué satisfacción y provecho!**

*Dulce Jesús mío, mi niño adorado*
*¡Ven a nuestras almas! ¡Ven no tardes tanto!*

---

🎄 **¡Gloria a Dios en las alturas y paz en la tierra a los hombres de buena voluntad!** 🎄""",
            },
            {
                "type": "VILLANCICO",
                "position": 4,
                "content": """## Villancico de Cierre

🎵 **Tutaina**

*Tutaina tuturumá*
*Tutaina tuturumaina*
*Tutaina tuturumá*
*Tutaina tuturumá*

*Los pastores de Belén*
*Vienen a adorar al Niño*
*La Virgen y San José*
*Los reciben con cariño*

*Tutaina tuturumá*
*Tutaina tuturumaina*
*Tutaina tuturumá*
*Tutaina tuturumá* 🎵""",
            },
        ],
    },
]


def seed_novenas():
    """Seed novena days and sections."""
    print("🎄 Seeding novena days...")

    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # Check if days already exist
        existing = session.query(NovenaDay).count()
        if existing > 0:
            print(f"⚠️  Already have {existing} novena days. Skipping seed.")
            return

        for day_data in NOVENA_DAYS:
            # Create day
            day = NovenaDay(
                day_number=day_data["day_number"],
                title=day_data["title"],
            )
            session.add(day)
            session.flush()  # Get the ID

            print(f"  📅 Day {day_data['day_number']}: {day_data['title']}")

            # Create sections
            for section_data in day_data["sections"]:
                section = NovenaDaySection(
                    day_id=day.id,
                    section_type=section_data["type"],
                    position=section_data["position"],
                    content_md=section_data["content"],
                )
                session.add(section)
                print(f"     └─ {section_data['type']} (pos {section_data['position']})")

        session.commit()
        print(f"\n✅ Successfully seeded {len(NOVENA_DAYS)} novena days!")

    except Exception as e:
        session.rollback()
        print(f"❌ Error seeding novenas: {e}")
        raise
    finally:
        session.close()


if __name__ == "__main__":
    seed_novenas()

