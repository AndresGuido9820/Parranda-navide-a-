import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRecipeService } from './utils/deleteRecipeService';

/**
 * Hook para eliminar una receta
 */
export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipeId: string): Promise<void> => {
      return deleteRecipeService(recipeId);
    },
    onSuccess: (_, recipeId) => {
      // Invalidar las queries relacionadas para que se actualicen los datos
      queryClient.invalidateQueries({ queryKey: ['myRecipes'] });
      queryClient.invalidateQueries({ queryKey: ['communityRecipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] });
    },
  });
};

