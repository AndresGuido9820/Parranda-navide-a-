/**
 * Tipos para las canciones de música navideña
 */
export interface Song {
  id: string;
  title: string;
  artist: string;
  image: string;
  audioUrl: string; // Puede ser URL de audio o ID de YouTube (formato: youtube:VIDEO_ID)
  duration?: number; // Duración en segundos
}

