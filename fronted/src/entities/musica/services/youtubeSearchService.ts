import { MOCK_SONGS } from '../data/mockSongs';
import type { Song } from '../types/song.types';

/**
 * Busca canciones en la biblioteca mock
 */
export const searchYouTubeVideos = async (query: string): Promise<Song[]> => {
  if (!query.trim()) {
    return [];
  }

  try {
    const searchLower = query.toLowerCase().trim();
    
    // Buscar en la biblioteca mock
    const filteredSongs = MOCK_SONGS.filter((song) => {
      const titleMatch = song.title.toLowerCase().includes(searchLower);
      const artistMatch = song.artist.toLowerCase().includes(searchLower);
      
      return titleMatch || artistMatch;
    });

    // Limitar a 20 resultados como la API original
    return filteredSongs.slice(0, 20);
  } catch (error) {
    console.error('Error al buscar en la biblioteca mock:', error);
    throw error;
  }
};

