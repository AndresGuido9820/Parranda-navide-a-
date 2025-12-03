/**
 * Recipe API Service
 * Servicio para comunicarse con el backend de recetas
 */

import { config } from '../../../shared/constants/config';
import type { RecipeResponse, CreateRecipeRequest, UpdateRecipeRequest } from '../types/recipe.types';

const API_BASE = `${config.API_URL}/api/v1/recipes`;
const UPLOADS_BASE = `${config.API_URL}/api/v1/uploads`;

// Helper para obtener el token de autenticación
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Tipos de respuesta del API
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[] | null;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// === GET Recipes (Lista) ===
export interface GetRecipesParams {
  page?: number;
  page_size?: number;
  category?: string;
  search?: string;
  tags?: string[];
}

export const getRecipes = async (params: GetRecipesParams = {}): Promise<RecipeResponse[]> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.page_size) searchParams.set('page_size', params.page_size.toString());
  if (params.category) searchParams.set('category', params.category);
  if (params.search) searchParams.set('search', params.search);
  if (params.tags?.length) {
    params.tags.forEach(tag => searchParams.append('tags', tag));
  }

  const url = `${API_BASE}?${searchParams.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al obtener las recetas');
  }

  const json: ApiResponse<PaginatedResponse<RecipeResponse>> = await response.json();
  
  if (!json.success) {
    throw new Error(json.message || 'Error al obtener las recetas');
  }

  return json.data.items;
};

// === GET Community Recipes ===
export const getCommunityRecipes = async (params: GetRecipesParams = {}): Promise<RecipeResponse[]> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.page_size) searchParams.set('page_size', params.page_size.toString());
  if (params.category) searchParams.set('category', params.category);
  if (params.search) searchParams.set('search', params.search);

  const url = `${API_BASE}/community?${searchParams.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al obtener las recetas de la comunidad');
  }

  const json: ApiResponse<PaginatedResponse<RecipeResponse>> = await response.json();
  
  if (!json.success) {
    throw new Error(json.message || 'Error al obtener las recetas');
  }

  return json.data.items;
};

// === GET My Recipes ===
export const getMyRecipes = async (params: GetRecipesParams = {}): Promise<RecipeResponse[]> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.page_size) searchParams.set('page_size', params.page_size.toString());
  if (params.category) searchParams.set('category', params.category);
  if (params.search) searchParams.set('search', params.search);

  const url = `${API_BASE}/my?${searchParams.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Debes iniciar sesión para ver tus recetas');
    }
    throw new Error('Error al obtener tus recetas');
  }

  const json: ApiResponse<PaginatedResponse<RecipeResponse>> = await response.json();
  
  if (!json.success) {
    throw new Error(json.message || 'Error al obtener tus recetas');
  }

  return json.data.items;
};

// === GET Recipe by ID ===
export const getRecipeById = async (recipeId: string): Promise<RecipeResponse> => {
  const response = await fetch(`${API_BASE}/${recipeId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Receta no encontrada');
    }
    throw new Error('Error al obtener la receta');
  }

  const json: ApiResponse<RecipeResponse> = await response.json();
  
  if (!json.success) {
    throw new Error(json.message || 'Error al obtener la receta');
  }

  return json.data;
};

// === UPLOAD Recipe Image ===
export const uploadRecipeImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('access_token');
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${UPLOADS_BASE}/recipe-image`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => null);
    throw new Error(errorJson?.detail || 'Error al subir la imagen');
  }

  const json: ApiResponse<{ url: string }> = await response.json();
  
  if (!json.success) {
    throw new Error(json.message || 'Error al subir la imagen');
  }

  return json.data.url;
};

// === CREATE Recipe ===
export const createRecipe = async (recipe: CreateRecipeRequest): Promise<RecipeResponse> => {
  // Si hay un archivo de imagen, subirlo primero a S3
  let photoUrl = recipe.photo_url || null;
  
  if (recipe.photo_file) {
    try {
      photoUrl = await uploadRecipeImage(recipe.photo_file);
    } catch (error) {
      console.error('Error uploading image:', error);
      // Continuar sin imagen si falla la subida
    }
  }

  // Transformar el request al formato del backend
  const backendRequest = {
    title: recipe.title,
    author_alias: recipe.author_alias,
    photo_url: photoUrl,
    prep_time_minutes: recipe.prep_time_minutes,
    yield_amount: recipe.yield || null,
    category: recipe.category || 'otros',
    tags: recipe.tags || [],
    steps: recipe.steps.map(step => ({
      instruction_md: step.instruction_md,
      ingredients_json: step.ingredients_json,
      time_minutes: step.time_minutes || null,
    })),
  };

  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(backendRequest),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => null);
    throw new Error(errorJson?.message || 'Error al crear la receta');
  }

  const json: ApiResponse<RecipeResponse> = await response.json();
  
  if (!json.success) {
    throw new Error(json.message || 'Error al crear la receta');
  }

  // Mapear yield_amount de vuelta a yield
  return {
    ...json.data,
    yield: (json.data as any).yield_amount || json.data.yield,
  };
};

// === UPDATE Recipe ===
export const updateRecipe = async (recipeId: string, recipe: Partial<UpdateRecipeRequest>): Promise<RecipeResponse> => {
  // Transformar el request al formato del backend
  const backendRequest: Record<string, unknown> = {};
  
  if (recipe.title !== undefined) backendRequest.title = recipe.title;
  if (recipe.author_alias !== undefined) backendRequest.author_alias = recipe.author_alias;
  if (recipe.photo_url !== undefined) backendRequest.photo_url = recipe.photo_url;
  if (recipe.prep_time_minutes !== undefined) backendRequest.prep_time_minutes = recipe.prep_time_minutes;
  if (recipe.yield !== undefined) backendRequest.yield_amount = recipe.yield;
  if (recipe.category !== undefined) backendRequest.category = recipe.category;
  if (recipe.tags !== undefined) backendRequest.tags = recipe.tags;

  const response = await fetch(`${API_BASE}/${recipeId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(backendRequest),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Receta no encontrada');
    }
    if (response.status === 403) {
      throw new Error('No tienes permiso para editar esta receta');
    }
    const errorJson = await response.json().catch(() => null);
    throw new Error(errorJson?.message || 'Error al actualizar la receta');
  }

  const json: ApiResponse<RecipeResponse> = await response.json();
  
  if (!json.success) {
    throw new Error(json.message || 'Error al actualizar la receta');
  }

  return {
    ...json.data,
    yield: (json.data as any).yield_amount || json.data.yield,
  };
};

// === DELETE Recipe ===
export const deleteRecipe = async (recipeId: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/${recipeId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Receta no encontrada');
    }
    if (response.status === 403) {
      throw new Error('No tienes permiso para eliminar esta receta');
    }
    const errorJson = await response.json().catch(() => null);
    throw new Error(errorJson?.message || 'Error al eliminar la receta');
  }

  const json: ApiResponse<null> = await response.json();
  
  if (!json.success) {
    throw new Error(json.message || 'Error al eliminar la receta');
  }
};

// === FAVORITES ===

export const getFavoriteIds = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE}/favorites/ids`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      return [];
    }
    throw new Error('Error al obtener favoritos');
  }

  const json: ApiResponse<{ favorite_ids: string[] }> = await response.json();
  
  if (!json.success) {
    throw new Error(json.message || 'Error al obtener favoritos');
  }

  return json.data.favorite_ids;
};

export const addFavorite = async (recipeId: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/${recipeId}/favorite`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Debes iniciar sesión para agregar a favoritos');
    }
    const errorJson = await response.json().catch(() => null);
    throw new Error(errorJson?.message || 'Error al agregar a favoritos');
  }
};

export const removeFavorite = async (recipeId: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/${recipeId}/favorite`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Debes iniciar sesión para quitar de favoritos');
    }
    const errorJson = await response.json().catch(() => null);
    throw new Error(errorJson?.message || 'Error al quitar de favoritos');
  }
};

export const getMyFavoriteRecipes = async (params: GetRecipesParams = {}): Promise<RecipeResponse[]> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.page_size) searchParams.set('page_size', params.page_size.toString());
  if (params.category) searchParams.set('category', params.category);
  if (params.search) searchParams.set('search', params.search);

  const url = `${API_BASE}/favorites/my?${searchParams.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Debes iniciar sesión para ver tus favoritos');
    }
    throw new Error('Error al obtener tus favoritos');
  }

  const json: ApiResponse<PaginatedResponse<RecipeResponse>> = await response.json();
  
  if (!json.success) {
    throw new Error(json.message || 'Error al obtener tus favoritos');
  }

  return json.data.items;
};

