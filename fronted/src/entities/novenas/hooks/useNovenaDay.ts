/**
 * Hook to fetch a single novena day by number.
 */

import { useQuery } from '@tanstack/react-query';

import { fetchNovenaDayByNumber } from '../services/novenaApiService';

export const useNovenaDay = (dayNumber: number) => {
  return useQuery({
    queryKey: ['novena-day', dayNumber],
    queryFn: () => fetchNovenaDayByNumber(dayNumber),
    enabled: dayNumber >= 1 && dayNumber <= 9,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

