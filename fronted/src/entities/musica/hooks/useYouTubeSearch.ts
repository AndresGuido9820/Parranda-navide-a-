import { useQuery } from '@tanstack/react-query';
import { searchYouTubeVideos } from '../services/youtubeSearchService';
import type { Song } from '../types/song.types';

/**
 * Hook para buscar videos en YouTube
 */
export const useYouTubeSearch = (query: string, enabled: boolean = true) => {
  return useQuery<Song[]>({
    queryKey: ['youtubeSearch', query],
    queryFn: () => searchYouTubeVideos(query),
    enabled: enabled && !!query.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });
};

