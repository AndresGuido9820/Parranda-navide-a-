import { deleteRecipe } from '../recipeApiService';

/**
 * Servicio para eliminar recetas
 * Usa la API real del backend
 */
export const deleteRecipeService = async (recipeId: string): Promise<void> => {
  return deleteRecipe(recipeId);
};
