import type { CreateRecipeRequest, RecipeResponse } from '../types/recipe.types';
import { createRecipe } from './recipeApiService';

/**
 * Servicio para crear recetas
 * Usa la API real del backend
 */
export const createRecipeService = async (data: CreateRecipeRequest): Promise<RecipeResponse> => {
  return createRecipe(data);
};
