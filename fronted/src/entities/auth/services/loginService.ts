import { useMutation } from '@tanstack/react-query';
import api from '../../../shared/api/api';
import type { AuthResponse, LoginRequest } from '../types';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<AuthResponse> => {
      const { data } = await api.post('/auth/login', credentials);
      const authData = data.data;
      
      // Guardar tokens en localStorage
      localStorage.setItem('access_token', authData.access_token);
      localStorage.setItem('refresh_token', authData.refresh_token);
      
      return authData;
    },
  });
};