import { useQuery } from '@tanstack/react-query';
import { getMyRecipes, type GetRecipesParams } from './recipeApiService';
import type { RecipeResponse } from '../types/recipe.types';

export const useGetMyRecipes = (params: GetRecipesParams = {}) => {
  return useQuery({
    queryKey: ['myRecipes', params],
    queryFn: async (): Promise<RecipeResponse[]> => {
      return getMyRecipes(params);
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    // Solo ejecutar si hay un token (usuario logueado)
    enabled: !!localStorage.getItem('access_token'),
  });
};
