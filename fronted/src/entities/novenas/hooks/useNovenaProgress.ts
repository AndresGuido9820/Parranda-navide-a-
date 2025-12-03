/**
 * Hook to manage user's novena progress.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  fetchUserProgress,
  markDayComplete,
} from '../services/novenaApiService';

export const useNovenaProgress = () => {
  return useQuery({
    queryKey: ['novena-progress'],
    queryFn: fetchUserProgress,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useMarkDayComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dayNumber: number) => markDayComplete(dayNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['novena-progress'] });
    },
  });
};
