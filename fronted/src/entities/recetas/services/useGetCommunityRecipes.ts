import { useQuery } from '@tanstack/react-query';
import { mockCommunityRecipes } from '../data/mockCommunityRecipes';
import type { RecipeResponse } from '../types/recipe.types';

export const useGetCommunityRecipes = () => {
  return useQuery({
    queryKey: ['communityRecipes'],
    queryFn: async (): Promise<RecipeResponse[]> => {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Retornar datos mock con steps incluidos
      return mockCommunityRecipes.map((recipe) => ({
        ...recipe,
        steps: recipe.steps || [],
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

