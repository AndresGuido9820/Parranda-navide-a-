import { useQuery } from '@tanstack/react-query';
import { getCommunityRecipes, type GetRecipesParams } from './recipeApiService';
import type { RecipeResponse } from '../types/recipe.types';

export const useGetCommunityRecipes = (params: GetRecipesParams = {}) => {
  return useQuery({
    queryKey: ['communityRecipes', params],
    queryFn: async (): Promise<RecipeResponse[]> => {
      return getCommunityRecipes(params);
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};
