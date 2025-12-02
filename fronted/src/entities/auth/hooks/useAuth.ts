import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../shared/api/api';
import { useLogin } from '../services/loginService';
import { useLogout } from '../services/logoutService';
import { useRegister } from '../services/registerService';
import type { User } from '../types';

interface UserResponse {
  id: string;
  email: string;
  full_name: string | null;
  alias: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const fetchCurrentUser = async (): Promise<UserResponse | null> => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  try {
    const response = await api.get<{ data: UserResponse }>('/auth/me');
    return response.data.data;
  } catch (error) {
    // Si el token es inválido, limpiamos
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return null;
  }
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const hasToken = !!localStorage.getItem('access_token');

  // Query para obtener el usuario actual
  const { 
    data: userData, 
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchCurrentUser,
    enabled: hasToken,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false,
  });

  const isAuthenticated = hasToken && !!userData;

  // Convertir UserResponse a User type
  const user: User | null = userData ? {
    id: userData.id,
    email: userData.email,
    full_name: userData.full_name,
    alias: userData.alias,
    phone: userData.phone,
    avatar_url: userData.avatar_url,
    is_active: userData.is_active,
    created_at: userData.created_at,
    updated_at: userData.updated_at,
  } : null;

  // Extraer mensaje de error del login
  const getLoginError = (): string | null => {
    if (!loginMutation.error) return null;
    
    const error = loginMutation.error as any;
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
      return error.response.data.errors[0];
    }
    if (error?.message) {
      return error.message;
    }
    return 'Error al iniciar sesión. Por favor, intenta nuevamente.';
  };

  // Login con refetch del usuario
  const login = async (credentials: { email: string; password: string }) => {
    const result = await loginMutation.mutateAsync(credentials);
    // Refetch user data después del login
    await refetchUser();
    return result;
  };

  // Logout con limpieza del caché
  const logout = async () => {
    await logoutMutation.mutateAsync();
    // Limpiar caché del usuario
    queryClient.setQueryData(['auth', 'me'], null);
    queryClient.invalidateQueries({ queryKey: ['auth'] });
  };

  return {
    // Estado del usuario
    user,
    isAuthenticated,
    isLoading: isLoadingUser,
    error: getLoginError(),
    
    // Mutaciones
    login,
    register: registerMutation.mutateAsync,
    logout,
    refetchUser,
    
    // Estados de las mutaciones
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};
