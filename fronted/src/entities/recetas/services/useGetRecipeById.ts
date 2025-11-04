import { useQuery } from '@tanstack/react-query';
import { mockCommunityRecipes } from '../data/mockCommunityRecipes';
import { mockMyRecipes } from '../data/mockMyRecipes';
import type { RecipeResponse } from '../types/recipe.types';

export const useGetRecipeById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async (): Promise<RecipeResponse | null> => {
      if (!id) return null;
      
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 200));
      
      // Buscar en todas las recetas (mis recetas + comunidad)
      const allRecipes = [...mockMyRecipes, ...mockCommunityRecipes];
      const recipe = allRecipes.find((r) => r.id === id);
      
      if (!recipe) return null;
      
      return {
        ...recipe,
        steps: recipe.steps || [],
      };
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

