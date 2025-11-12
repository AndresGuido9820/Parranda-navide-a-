import { useQuery } from '@tanstack/react-query';
import { mockMyRecipes } from '../data/mockMyRecipes';
import type { RecipeResponse } from '../types/recipe.types';

export const useGetMyRecipes = () => {
  return useQuery({
    queryKey: ['myRecipes'],
    queryFn: async (): Promise<RecipeResponse[]> => {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Retornar datos mock con steps incluidos
      return mockMyRecipes.map((recipe) => ({
        ...recipe,
        steps: recipe.steps || [],
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

