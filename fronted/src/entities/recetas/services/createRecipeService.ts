import type { CreateRecipeRequest, RecipeResponse } from '../types/recipe.types';

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
 * Servicio para crear recetas
 * Por ahora usa mock, pero preparado para cambiar a API
 */
const USE_MOCK = true;

/**
 * Servicio mock para crear recetas
 */
const createRecipeMock = async (data: CreateRecipeRequest): Promise<RecipeResponse> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Importar dinámicamente para evitar dependencias circulares
  const mockData = await import('../data/mockMyRecipes');
  const { mockMyRecipes, generateId, createRecipeWithSteps, mockUserId } = mockData;

  // Convertir archivo de imagen a URL si existe
  let photo_url: string | null = data.photo_url || null;
  if (data.photo_file && !photo_url) {
    try {
      photo_url = await fileToObjectURL(data.photo_file);
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      photo_url = null;
    }
  }

  // Crear la nueva receta
  const newRecipe = createRecipeWithSteps(
    {
      id: generateId(),
      title: data.title,
      author_user_id: mockUserId,
      author_alias: data.author_alias,
      photo_url,
      prep_time_minutes: data.prep_time_minutes,
      yield: data.yield,
      category: data.category || null,
      rating: undefined, // Sin rating inicial
      tags: data.tags || [],
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    data.steps.map((step) => ({
      instruction_md: step.instruction_md,
      ingredients_json: step.ingredients_json || [],
      time_minutes: step.time_minutes,
    }))
  );

  // Agregar la receta al array mock (modificando el array exportado)
  mockMyRecipes.unshift(newRecipe);

  return {
    ...newRecipe,
    steps: newRecipe.steps || [],
  };
};

/**
 * Servicio API para crear recetas
 */
const createRecipeAPI = async (data: CreateRecipeRequest): Promise<RecipeResponse> => {
  // Dinámico para evitar dependencias circulares
  const api = (await import('../../../shared/api/api')).default;

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

  const { data: response } = await api.post<{ data: RecipeResponse }>('/recipes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Servicio principal para crear recetas
 */
export const createRecipeService = async (data: CreateRecipeRequest): Promise<RecipeResponse> => {
  if (USE_MOCK) {
    return createRecipeMock(data);
  }
  return createRecipeAPI(data);
};

