import { searchSongs } from './songApiService';
import type { Song } from '../types/song.types';

/**
 * Busca canciones en la API del backend
 */
export const searchYouTubeVideos = async (query: string): Promise<Song[]> => {
  return searchSongs(query);
};
