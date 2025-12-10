import { useQuery } from '@tanstack/react-query';
import { getMyRecipes, type GetRecipesParams } from './recipeApiService';
import type { RecipeResponse } from '../types/recipe.types';

export const useGetMyRecipes = (params: GetRecipesParams = {}) => {
  // Obtener token para incluir en la query key (diferente por usuario)
  const token = localStorage.getItem('access_token');
  
  // Filtrar params undefined para query key limpia
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined)
  );

  return useQuery({
    // Incluir token en la key para que cada usuario tenga su propio cache
    queryKey: ['myRecipes', token?.slice(-10), cleanParams],
    queryFn: async (): Promise<RecipeResponse[]> => {
      return getMyRecipes(cleanParams);
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    // Solo ejecutar si hay un token (usuario logueado)
    enabled: !!token,
  });
};
