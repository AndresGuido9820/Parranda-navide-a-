#!/usr/bin/env python3
"""
Script para poblar la base de datos con canciones navideñas.
Ejecutar desde la raíz del proyecto: python -m app.scripts.seed_songs
"""

import sys
from pathlib import Path
from uuid import uuid4
from datetime import datetime, timezone

# Agregar el directorio raíz al path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.infrastructure.persistence.sqlalchemy.engine import get_supabase_client
from app.infrastructure.persistence.sqlalchemy.supabase_helpers import table


# Datos de las canciones (extraídos del mock del frontend)
SONGS_DATA = [
    # Villancicos en español
    {"youtube_id": "C0YImrwIypo", "title": "Noche de Paz, Juana, Villancico Animado", "artist": "Mundo Canticuentos", "duration": 213, "genre": "villancico"},
    {"youtube_id": "hxgVn22M2GE", "title": "Noche de Paz - Los Niños Cantores de Navidad", "artist": "Discos Fuentes Edimusica", "duration": 202, "genre": "villancico"},
    {"youtube_id": "SF47MzYs_l4", "title": "Noche de paz con letra", "artist": "luis fernando gallo romero", "duration": 190, "genre": "villancico"},
    {"youtube_id": "01Nh53Xt1s4", "title": "Blanca Navidad", "artist": "Luis Miguel", "duration": 213, "genre": "villancico"},
    {"youtube_id": "EpkOXf9umks", "title": "Daniela Romo - Blanca Navidad", "artist": "EternaNavidadVEVO", "duration": 191, "genre": "villancico"},
    {"youtube_id": "QgioGSUUeL8", "title": "Andrea Bocelli – Blanca Navidad", "artist": "Andrea Bocelli", "duration": 238, "genre": "villancico"},
    {"youtube_id": "28HpAyGM0Ug", "title": "Pandora - Blanca Navidad", "artist": "PandoraOficialVEVO", "duration": 192, "genre": "villancico"},
    {"youtube_id": "6f7GJmmJPts", "title": "Alejandro Fernández, América, Camila, Valentina Fernández - Blanca Navidad", "artist": "AFernandezVEVO", "duration": 176, "genre": "villancico"},
    {"youtube_id": "JPbkeTU1kgo", "title": "Jingle Bells", "artist": "Super Simple Songs", "duration": 151, "genre": "villancico"},
    {"youtube_id": "5JGfvDqZEgM", "title": "Jingle Bells", "artist": "Gwen Stefani", "duration": 178, "genre": "pop"},
    {"youtube_id": "2fRQ8HAzcHA", "title": "Jingle Bells", "artist": "Alan Jackson", "duration": 171, "genre": "country"},
    {"youtube_id": "N8NcQzMQN_U", "title": "José Feliciano - Feliz Navidad", "artist": "JoseFelicianoVEVO", "duration": 184, "genre": "villancico"},
    {"youtube_id": "blcAIE9POSU", "title": "Feliz Navidad, Juana, Villancico Clásico Animado", "artist": "Mundo Canticuentos", "duration": 159, "genre": "villancico"},
    {"youtube_id": "cRbLtqbPYjU", "title": "José Feliciano - Feliz Navidad (Lyrics)", "artist": "7clouds", "duration": 182, "genre": "villancico"},
    {"youtube_id": "k6vN9p4tLlM", "title": "Mi Burrito Sabanero, Juana", "artist": "Mundo Canticuentos", "duration": 195, "genre": "villancico"},
    {"youtube_id": "lJawRaON8h0", "title": "Mi Burrito Sabanero, Juana, Villancico Animado", "artist": "Mundo Canticuentos", "duration": 193, "genre": "villancico"},
    {"youtube_id": "_Wrc6Q7acME", "title": "Mi Burrito Sabanero", "artist": "cuteambros15", "duration": 191, "genre": "villancico"},
    {"youtube_id": "IhO3Y1unYGE", "title": "Campana Sobre Campana, Villancico Animado", "artist": "Mundo Canticuentos", "duration": 168, "genre": "villancico"},
    {"youtube_id": "BnLSu1Xsz5w", "title": "Pandora, Yuri - Campana Sobre Campana", "artist": "YuriOficialVEVO", "duration": 132, "genre": "villancico"},
    {"youtube_id": "q3hho2sLIy4", "title": "Campana Sobre Campana", "artist": "Yuri", "duration": 159, "genre": "villancico"},
    {"youtube_id": "dppTvVUxJwc", "title": "Campana Sobre Campana", "artist": "RBD", "duration": 184, "genre": "pop"},
    {"youtube_id": "yfpBMrJZt1Q", "title": "Los Peces En El Río, Villancico Animado", "artist": "Mundo Canticuentos", "duration": 132, "genre": "villancico"},
    {"youtube_id": "goZ6wIKE58Q", "title": "Los Peces en el Rio - Los Niños Cantores de Navidad", "artist": "Discos Fuentes Edimusica", "duration": 133, "genre": "villancico"},
    {"youtube_id": "9w8HNsAtHAY", "title": "Pandora - Los Peces en el Río", "artist": "PandoraOficialVEVO", "duration": 163, "genre": "villancico"},
    {"youtube_id": "S8k36__ShUE", "title": "Angela Aguilar - Los Peces En El Río", "artist": "Angela Aguilar Oficial", "duration": 189, "genre": "villancico"},
    {"youtube_id": "HWOhMpAw0Mk", "title": "Rodolfo El Reno", "artist": "Grupo Nueva América Orquesta y Coros", "duration": 161, "genre": "villancico"},
    {"youtube_id": "uArFYpxDOoU", "title": "El Reno Rodolfo | Canción popular navideña", "artist": "Peque Música", "duration": 108, "genre": "villancico"},
    {"youtube_id": "bl7p0PiNQuY", "title": "Rodolfo El Reno, Villancico Clásico Animado", "artist": "Mundo Canticuentos", "duration": 193, "genre": "villancico"},
    {"youtube_id": "OnIU8WWdVqY", "title": "Rodolfo el Reno", "artist": "Tatiana", "duration": 183, "genre": "villancico"},
    {"youtube_id": "aAkMkVFwAoo", "title": "Mariah Carey - All I Want for Christmas Is You", "artist": "MariahCareyVEVO", "duration": 243, "genre": "pop"},
    {"youtube_id": "5ipkAxRm_Pw", "title": "Ven A Cantar, Juana, Villancico Animado", "artist": "Mundo Canticuentos", "duration": 220, "genre": "villancico"},
    {"youtube_id": "zHxg73ppMbs", "title": "Tutaina, Villancico Animado", "artist": "Mundo Canticuentos", "duration": 128, "genre": "villancico"},
    
    # Música navideña en inglés
    {"youtube_id": "yXQViqx6GMY", "title": "Mariah Carey - All I Want For Christmas Is You", "artist": "MariahCareyVEVO", "duration": 235, "genre": "pop"},
    {"youtube_id": "E8gmARGvPlI", "title": "Wham! - Last Christmas", "artist": "WhamVEVO", "duration": 279, "genre": "pop"},
    {"youtube_id": "MLrx0P8p_s8", "title": "Last Christmas", "artist": "Wham!", "duration": 287, "genre": "pop"},
    {"youtube_id": "fGFNmEOntFA", "title": "Justin Bieber, Mariah Carey - All I Want For Christmas Is You", "artist": "JustinBieberVEVO", "duration": 254, "genre": "pop"},
    {"youtube_id": "-Ea_1vStswA", "title": "Backstreet Boys - Last Christmas", "artist": "Backstreet Boys", "duration": 258, "genre": "pop"},
    {"youtube_id": "nIhs1T7OcZg", "title": "Bobby Helms - Jingle Bell Rock", "artist": "Pizza Music", "duration": 131, "genre": "rock"},
    
    # Rap navideño / Colombiano
    {"youtube_id": "7eqzpjUu1_c", "title": "AlcolirykoZ - Baño de ruda", "artist": "AlcolirykoZ", "duration": 197, "genre": "rap"},
    {"youtube_id": "J3-hTJvqBMw", "title": "AlcolirykoZ - El Estrén", "artist": "AlcolirykoZ", "duration": 285, "genre": "rap"},
    {"youtube_id": "6NErjG-Ayy4", "title": "El Estrén (Versión álbum)", "artist": "Crudo Means Raw", "duration": 165, "genre": "rap"},
    {"youtube_id": "hwgfwi2wnX4", "title": "Crudo Means Raw - Hubiera", "artist": "CRUDO MEANS RAW", "duration": 223, "genre": "rap"},
    {"youtube_id": "OV4hbqYxRh0", "title": "No Copio", "artist": "Crudo Means Raw", "duration": 206, "genre": "rap"},
    {"youtube_id": "G795ZdgVkaY", "title": "María", "artist": "Crudo Means Raw", "duration": 156, "genre": "rap"},
    {"youtube_id": "cgJvtgZ7rBk", "title": "VITAL (TÉNGASE) - LA INFUSIÓN I - CRUDO MEANS RAW", "artist": "CRUDO MEANS RAW", "duration": 153, "genre": "rap"},
    
    # Canciones colombianas de diciembre
    {"youtube_id": "3IISwkIQX1w", "title": "El Ausente (Remastered)", "artist": "Pastor Lopez", "duration": 207, "genre": "tropical"},
    {"youtube_id": "vvTOScNMQB4", "title": "El Hijo Ausente - Pastor López", "artist": "Discos Fuentes Edimusica", "duration": 174, "genre": "tropical"},
    {"youtube_id": "70g_ARWpjBQ", "title": "Cariñito", "artist": "Rodolfo Aicardi", "duration": 227, "genre": "tropical"},
    {"youtube_id": "Dj_pcjR1fIM", "title": "Adonay", "artist": "Rodolfo Aicardi", "duration": 190, "genre": "tropical"},
    {"youtube_id": "Uz4OOpYWs0A", "title": "Traicionera - Pastor López", "artist": "Discos Fuentes Edimusica", "duration": 210, "genre": "tropical"},
    {"youtube_id": "Q_V_85VqYVc", "title": "Ay No Se Puede", "artist": "Pastor Lopez", "duration": 341, "genre": "tropical"},
    {"youtube_id": "Czt9wS6cIHQ", "title": "Bendito Diciembre, Los Betos", "artist": "Fiesta Vallenata", "duration": 246, "genre": "vallenato"},
    {"youtube_id": "YrpXK_oMeak", "title": "Diomedes Díaz - Las Cuatro Fiestas", "artist": "Diomedes Díaz Oficial", "duration": 272, "genre": "vallenato"},
    {"youtube_id": "GMRbOELviW4", "title": "El Ciclón", "artist": "Gran Combo de Colombia", "duration": 228, "genre": "tropical"},
    {"youtube_id": "RjbEyUdloxk", "title": "Tonto Amor - Hernán Hernández", "artist": "LA TROPICALISIMA", "duration": 208, "genre": "tropical"},
]


def seed_songs():
    """Inserta las canciones en la base de datos usando Supabase."""
    client = get_supabase_client()

    existing = table(client, "songs").select("youtube_video_id").execute()
    existing_ids = {item["youtube_video_id"] for item in existing.data or []}

    inserted = 0
    skipped = 0

    for song_data in SONGS_DATA:
        if song_data["youtube_id"] in existing_ids:
            print(f"⏭️  Saltando (ya existe): {song_data['title'][:50]}")
            skipped += 1
            continue

        payload = {
            "id": str(uuid4()),
            "youtube_video_id": song_data["youtube_id"],
            "title": song_data["title"],
            "artist": song_data["artist"],
            "thumbnail_url": f"https://i.ytimg.com/vi/{song_data['youtube_id']}/mqdefault.jpg",
            "duration_seconds": song_data["duration"],
            "genre": song_data["genre"],
            "is_christmas": True,
            "is_active": True,
            "created_at": datetime.now(timezone.utc),
        }
        table(client, "songs").insert(payload).execute()
        print(f"✅ Insertando: {song_data['title'][:50]}")
        inserted += 1

    print(f"\n{'='*50}")
    print("📊 Resumen:")
    print(f"   ✅ Canciones insertadas: {inserted}")
    print(f"   ⏭️  Canciones saltadas: {skipped}")
    print(f"   📦 Total en base de datos: {inserted + skipped + len(existing_ids)}")


if __name__ == "__main__":
    print("🎵 Poblando base de datos con canciones navideñas...")
    print("="*50)
    seed_songs()
    print("\n🎄 ¡Listo! Base de datos poblada con canciones navideñas.")

