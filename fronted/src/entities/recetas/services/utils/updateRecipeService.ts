import type { RecipeResponse, UpdateRecipeRequest } from '../../types/recipe.types';
import { updateRecipe } from '../recipeApiService';

/**
 * Servicio para actualizar recetas
 * Usa la API real del backend
 */
export const updateRecipeService = async (
  recipeId: string,
  data: UpdateRecipeRequest
): Promise<RecipeResponse> => {
  return updateRecipe(recipeId, data);
};
