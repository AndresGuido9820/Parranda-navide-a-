import type { RecipeResponse, UpdateRecipeRequest } from '../../types/recipe.types';

/**
 * Convierte un archivo File a una URL de objeto para usar en mocks
 */
const fileToObjectURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Servicio para actualizar recetas
 * Por ahora usa mock, pero preparado para cambiar a API
 */
const USE_MOCK = true;

/**
 * Servicio mock para actualizar recetas
 */
const updateRecipeMock = async (
  recipeId: string,
  data: UpdateRecipeRequest
): Promise<RecipeResponse> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Importar dinámicamente para evitar dependencias circulares
  const mockData = await import('../../data/mockMyRecipes');
  const { mockMyRecipes, createRecipeWithSteps, mockUserId } = mockData;

  // Buscar la receta existente
  const existingRecipeIndex = mockMyRecipes.findIndex((r) => r.id === recipeId);
  if (existingRecipeIndex === -1) {
    throw new Error('Receta no encontrada');
  }

  const existingRecipe = mockMyRecipes[existingRecipeIndex];

  // Convertir archivo de imagen a URL si existe
  let photo_url: string | null = data.photo_url || existingRecipe.photo_url || null;
  if (data.photo_file && !data.photo_url) {
    try {
      photo_url = await fileToObjectURL(data.photo_file);
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      // Mantener la imagen anterior si hay error
      photo_url = existingRecipe.photo_url;
    }
  }

  // Actualizar la receta
  const updatedRecipe = createRecipeWithSteps(
    {
      id: recipeId, // Mantener el mismo ID
      title: data.title,
      author_user_id: existingRecipe.author_user_id || mockUserId,
      author_alias: data.author_alias,
      photo_url,
      prep_time_minutes: data.prep_time_minutes,
      yield: data.yield,
      category: data.category || undefined,
      rating: existingRecipe.rating, // Mantener el rating existente
      tags: data.tags || [],
      is_published: existingRecipe.is_published,
      created_at: existingRecipe.created_at, // Mantener fecha de creación
      updated_at: new Date().toISOString(), // Actualizar fecha de modificación
    },
    data.steps.map((step) => ({
      instruction_md: step.instruction_md,
      ingredients_json: step.ingredients_json || [],
      time_minutes: step.time_minutes,
    }))
  );

  // Reemplazar la receta en el array
  mockMyRecipes[existingRecipeIndex] = updatedRecipe;

  return {
    ...updatedRecipe,
    steps: updatedRecipe.steps || [],
  };
};

/**
 * Servicio API para actualizar recetas
 */
const updateRecipeAPI = async (
  recipeId: string,
  data: UpdateRecipeRequest
): Promise<RecipeResponse> => {
  // Dinámico para evitar dependencias circulares
  const api = (await import('../../../../shared/api/api')).default;

  // Crear FormData para enviar archivos
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('author_alias', data.author_alias);
  formData.append('prep_time_minutes', data.prep_time_minutes.toString());

  if (data.yield) {
    formData.append('yield', data.yield);
  }
  if (data.category) {
    formData.append('category', data.category);
  }
  if (data.tags) {
    formData.append('tags', JSON.stringify(data.tags));
  }
  if (data.photo_file) {
    formData.append('photo', data.photo_file);
  }

  // Enviar pasos como JSON
  formData.append('steps', JSON.stringify(data.steps));

  const { data: response } = await api.put<{ data: RecipeResponse }>(
    `/recipes/${recipeId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

/**
 * Servicio principal para actualizar recetas
 */
export const updateRecipeService = async (
  recipeId: string,
  data: UpdateRecipeRequest
): Promise<RecipeResponse> => {
  if (USE_MOCK) {
    return updateRecipeMock(recipeId, data);
  }
  return updateRecipeAPI(recipeId, data);
};

