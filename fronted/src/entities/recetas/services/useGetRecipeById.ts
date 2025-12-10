import { useQuery } from '@tanstack/react-query';
import type { RecipeResponse } from '../types/recipe.types';
import { getRecipeById } from './recipeApiService';

export const useGetRecipeById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async (): Promise<RecipeResponse | null> => {
      if (!id) return null;
      return getRecipeById(id);
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};
