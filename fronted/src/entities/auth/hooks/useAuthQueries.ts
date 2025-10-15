import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import type { LoginRequest, RegisterRequest, User } from '../types';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
} as const;

// Hook para obtener el usuario actual
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async (): Promise<User> => {
      const user = await authService.getCurrentUser();
      return user as User;
    },
    enabled: authService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook para login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await authService.login(credentials);
      authService.setTokens(response.access_token, response.refresh_token);
      return response;
    },
    onSuccess: (data) => {
      // Actualizar el cache con el usuario
      queryClient.setQueryData(authKeys.user(), data.user);
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

// Hook para registro
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const response = await authService.register(userData);
      authService.setTokens(response.access_token, response.refresh_token);
      return response;
    },
    onSuccess: (data) => {
      // Actualizar el cache con el usuario
      queryClient.setQueryData(authKeys.user(), data.user);
    },
    onError: (error) => {
      console.error('Register error:', error);
    },
  });
};

// Hook para logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authService.logout();
    },
    onSuccess: () => {
      // Limpiar el cache
      queryClient.clear();
      authService.clearTokens();
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Limpiar el cache incluso si hay error
      queryClient.clear();
      authService.clearTokens();
    },
  });
};

// Hook para refresh token
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await authService.refreshToken();
      return response;
    },
    onSuccess: (data) => {
      authService.setTokens(data.access_token, authService.getRefreshToken() || '');
    },
    onError: () => {
      // Si falla el refresh, limpiar todo
      queryClient.clear();
      authService.clearTokens();
    },
  });
};
