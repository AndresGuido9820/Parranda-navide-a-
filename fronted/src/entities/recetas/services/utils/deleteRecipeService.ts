/**
 * Servicio para eliminar recetas
 * Por ahora usa mock, pero preparado para cambiar a API
 */
const USE_MOCK = true;

/**
 * Servicio mock para eliminar recetas
 */
const deleteRecipeMock = async (recipeId: string): Promise<void> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Importar dinámicamente para evitar dependencias circulares
  const { mockMyRecipes } = await import('../../data/mockMyRecipes');

  // Buscar el índice de la receta
  const recipeIndex = mockMyRecipes.findIndex((r) => r.id === recipeId);
  if (recipeIndex === -1) {
    throw new Error('Receta no encontrada');
  }

  // Eliminar la receta del array
  mockMyRecipes.splice(recipeIndex, 1);
};

/**
 * Servicio API para eliminar recetas
 */
const deleteRecipeAPI = async (recipeId: string): Promise<void> => {
  // Dinámico para evitar dependencias circulares
  const api = (await import('../../../../shared/api/api')).default;

  await api.delete(`/recipes/${recipeId}`);
};

/**
 * Servicio principal para eliminar recetas
 */
export const deleteRecipeService = async (recipeId: string): Promise<void> => {
  if (USE_MOCK) {
    return deleteRecipeMock(recipeId);
  }
  return deleteRecipeAPI(recipeId);
};

