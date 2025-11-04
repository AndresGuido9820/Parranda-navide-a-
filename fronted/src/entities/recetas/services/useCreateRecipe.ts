import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateRecipeRequest, RecipeResponse } from '../types/recipe.types';
import { createRecipeService } from './createRecipeService';

/**
 * Hook para crear una receta
 */
export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRecipeRequest): Promise<RecipeResponse> => {
      return createRecipeService(data);
    },
    onSuccess: () => {
      // Invalidar las queries relacionadas para que se actualicen los datos
      queryClient.invalidateQueries({ queryKey: ['myRecipes'] });
      queryClient.invalidateQueries({ queryKey: ['communityRecipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe'] });
    },
  });
};

