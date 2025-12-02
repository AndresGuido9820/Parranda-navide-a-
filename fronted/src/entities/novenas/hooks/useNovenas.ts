/**
 * Hook to fetch all novena days.
 */

import { useQuery } from '@tanstack/react-query';

import { fetchNovenaDays } from '../services/novenaApiService';

export const useNovenas = (includeSections = false) => {
  return useQuery({
    queryKey: ['novenas', { includeSections }],
    queryFn: () => fetchNovenaDays(includeSections),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

