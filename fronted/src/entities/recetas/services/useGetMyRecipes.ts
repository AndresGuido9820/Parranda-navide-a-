import { useQuery } from '@tanstack/react-query';
import { getMyRecipes, type GetRecipesParams } from './recipeApiService';
import type { RecipeResponse } from '../types/recipe.types';

export const useGetMyRecipes = (params: GetRecipesParams = {}) => {
  // Filtrar params undefined para query key limpia
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined)
  );

  return useQuery({
    queryKey: ['myRecipes', cleanParams],
    queryFn: async (): Promise<RecipeResponse[]> => {
      return getMyRecipes(cleanParams);
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    // Solo ejecutar si hay un token (usuario logueado)
    enabled: !!localStorage.getItem('access_token'),
  });
};
