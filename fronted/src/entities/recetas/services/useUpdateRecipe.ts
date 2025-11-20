import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateRecipeRequest, RecipeResponse } from '../types/recipe.types';
import { updateRecipeService } from './utils/updateRecipeService';

/**
 * Hook para actualizar una receta
 */
export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      recipeId,
      data,
    }: {
      recipeId: string;
      data: UpdateRecipeRequest;
    }): Promise<RecipeResponse> => {
      return updateRecipeService(recipeId, data);
    },
    onSuccess: (_, variables) => {
      // Invalidar las queries relacionadas para que se actualicen los datos
      queryClient.invalidateQueries({ queryKey: ['myRecipes'] });
      queryClient.invalidateQueries({ queryKey: ['communityRecipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe', variables.recipeId] });
    },
  });
};

