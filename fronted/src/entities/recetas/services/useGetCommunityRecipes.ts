import { useQuery } from '@tanstack/react-query';
import { getCommunityRecipes, type GetRecipesParams } from './recipeApiService';
import type { RecipeResponse } from '../types/recipe.types';

export const useGetCommunityRecipes = (params: GetRecipesParams = {}) => {
  // Filtrar params undefined para query key limpia
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined)
  );

  return useQuery({
    queryKey: ['communityRecipes', cleanParams],
    queryFn: async (): Promise<RecipeResponse[]> => {
      return getCommunityRecipes(cleanParams);
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};
