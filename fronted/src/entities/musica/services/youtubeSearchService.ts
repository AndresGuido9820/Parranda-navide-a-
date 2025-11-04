import type { Song } from '../types/song.types';

interface YouTubeSearchResponse {
  items: Array<{
    id: {
      videoId: string;
    };
    snippet: {
      title: string;
      channelTitle: string;
      thumbnails: {
        medium: {
          url: string;
        };
      };
    };
  }>;
}

interface YouTubeVideoDetailsResponse {
  items: Array<{
    contentDetails: {
      duration: string; // ISO 8601 format (PT3M45S)
    };
  }>;
}

/**
 * Convierte duración ISO 8601 a segundos
 * Ejemplo: "PT3M45S" -> 225
 */
const parseDuration = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Busca videos en YouTube usando la API de YouTube Data v3
 */
export const searchYouTubeVideos = async (query: string): Promise<Song[]> => {
  // API key hardcodeada temporalmente
  const API_KEY = 'AIzaSyAerKdqyetOx5g7UH0fXugjlKA1yPDT-Vk';
  console.log('API_KEY', API_KEY);

  if (!query.trim()) {
    return [];
  }

  try {
    // Buscar videos
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&` +
      `q=${encodeURIComponent(query)}&` +
      `type=video&` +
      `maxResults=20&` +
      `videoCategoryId=10&` + // Música
      `key=${API_KEY}`
    );

    if (!searchResponse.ok) {
      throw new Error(`Error al buscar videos: ${searchResponse.statusText}`);
    }

    const searchData: YouTubeSearchResponse = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }

    // Obtener IDs de videos para obtener duraciones
    const videoIds = searchData.items.map((item) => item.id.videoId).join(',');

    // Obtener detalles de los videos (duración)
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?` +
      `part=contentDetails&` +
      `id=${videoIds}&` +
      `key=${API_KEY}`
    );

    const detailsData: YouTubeVideoDetailsResponse = await detailsResponse.json();
    const durationMap = new Map<string, number>();

    if (detailsData.items) {
      detailsData.items.forEach((item, index) => {
        const videoId = videoIds.split(',')[index];
        const duration = parseDuration(item.contentDetails.duration);
        durationMap.set(videoId, duration);
      });
    }

    // Convertir resultados a formato Song
    const songs: Song[] = searchData.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      image: item.snippet.thumbnails.medium.url,
      audioUrl: `youtube:${item.id.videoId}`,
      duration: durationMap.get(item.id.videoId),
    }));

    return songs;
  } catch (error) {
    console.error('Error al buscar videos de YouTube:', error);
    throw error;
  }
};

