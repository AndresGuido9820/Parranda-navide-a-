import { useQuery } from '@tanstack/react-query';
import { getDefaultSongs } from '../services/songApiService';
import type { Song } from '../types/song.types';

export const useDefaultSongs = () => {
  return useQuery({
    queryKey: ['defaultSongs'],
    queryFn: async (): Promise<Song[]> => {
      return getDefaultSongs();
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

