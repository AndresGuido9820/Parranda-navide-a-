/**
 * Hook to manage user's novena progress.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  fetchUserProgress,
  markDayComplete,
  resetProgress,
  updateLastRead,
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

export const useUpdateLastRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dayNumber: number) => updateLastRead(dayNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['novena-progress'] });
    },
  });
};

export const useResetProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['novena-progress'] });
    },
  });
};

