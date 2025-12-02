/**
 * Song API Service
 * Servicio para comunicarse con el backend de canciones
 */

import { config } from '../../../shared/constants/config';
import type { Song } from '../types/song.types';

const API_BASE = `${config.API_URL}/api/v1/songs`;

// Tipos de respuesta del API
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[] | null;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Tipo del backend
interface BackendSong {
  id: string;
  title: string;
  artist: string;
  youtube_id: string;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  genre: string | null;
  is_christmas: boolean;
  created_at: string;
  updated_at: string;
}

// Convertir respuesta del backend al formato del frontend
const toFrontendSong = (song: BackendSong): Song => ({
  id: song.youtube_id,
  title: song.title,
  artist: song.artist,
  image: song.thumbnail_url || `https://i.ytimg.com/vi/${song.youtube_id}/mqdefault.jpg`,
  audioUrl: `youtube:${song.youtube_id}`,
  duration: song.duration_seconds || undefined,
});

// === GET Songs (Lista desde API) ===
export interface GetSongsParams {
  page?: number;
  page_size?: number;
  search?: string;
  genre?: string;
  is_christmas?: boolean;
}

export const getSongsFromApi = async (params: GetSongsParams = {}): Promise<Song[]> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.page_size) searchParams.set('page_size', params.page_size.toString());
  if (params.search) searchParams.set('search', params.search);
  if (params.genre) searchParams.set('genre', params.genre);
  if (params.is_christmas !== undefined) {
    searchParams.set('is_christmas', params.is_christmas.toString());
  }

  const url = `${API_BASE}?${searchParams.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Error al obtener las canciones');
  }

  const json: ApiResponse<PaginatedResponse<BackendSong>> = await response.json();
  
  if (!json.success) {
    throw new Error(json.message || 'Error al obtener las canciones');
  }

  return json.data.items.map(toFrontendSong);
};

// === Búsqueda de canciones ===
export const searchSongs = async (query: string): Promise<Song[]> => {
  if (!query.trim()) {
    return [];
  }

  return getSongsFromApi({ search: query, page_size: 20 });
};

// === Obtener canciones por defecto ===
export const getDefaultSongs = async (): Promise<Song[]> => {
  return getSongsFromApi({ page_size: 20 });
};
