/**
 * Hooks para gestionar favoritos de recetas
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addFavorite,
  getFavoriteIds,
  getMyFavoriteRecipes,
  removeFavorite,
} from './recipeApiService';

// Hook para obtener los IDs de recetas favoritas
export const useGetFavoriteIds = () => {
  return useQuery({
    queryKey: ['favoriteIds'],
    queryFn: getFavoriteIds,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para obtener las recetas favoritas completas
export const useGetMyFavorites = (page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: ['myFavorites', page, pageSize],
    queryFn: () => getMyFavoriteRecipes({ page, page_size: pageSize }),
    staleTime: 1000 * 60 * 5,
  });
};

// Hook para agregar a favoritos
export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,
    onMutate: async (recipeId: string) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: ['favoriteIds'] });

      // Guardar el estado previo
      const previousFavorites = queryClient.getQueryData<string[]>(['favoriteIds']);

      // Actualizar optimistamente
      queryClient.setQueryData<string[]>(['favoriteIds'], (old) => {
        if (!old) return [recipeId];
        if (old.includes(recipeId)) return old;
        return [...old, recipeId];
      });

      return { previousFavorites };
    },
    onError: (_err, _recipeId, context) => {
      // Revertir en caso de error
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favoriteIds'], context.previousFavorites);
      }
    },
    onSettled: () => {
      // Refrescar datos
      queryClient.invalidateQueries({ queryKey: ['favoriteIds'] });
      queryClient.invalidateQueries({ queryKey: ['myFavorites'] });
    },
  });
};

// Hook para quitar de favoritos
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFavorite,
    onMutate: async (recipeId: string) => {
      await queryClient.cancelQueries({ queryKey: ['favoriteIds'] });

      const previousFavorites = queryClient.getQueryData<string[]>(['favoriteIds']);

      queryClient.setQueryData<string[]>(['favoriteIds'], (old) => {
        if (!old) return [];
        return old.filter((id) => id !== recipeId);
      });

      return { previousFavorites };
    },
    onError: (_err, _recipeId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favoriteIds'], context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteIds'] });
      queryClient.invalidateQueries({ queryKey: ['myFavorites'] });
    },
  });
};

// Hook combinado para toggle de favorito
export const useToggleFavorite = () => {
  const addMutation = useAddFavorite();
  const removeMutation = useRemoveFavorite();

  const toggle = (recipeId: string, isFavorite: boolean) => {
    if (isFavorite) {
      removeMutation.mutate(recipeId);
    } else {
      addMutation.mutate(recipeId);
    }
  };

  return {
    toggle,
    isLoading: addMutation.isPending || removeMutation.isPending,
  };
};


