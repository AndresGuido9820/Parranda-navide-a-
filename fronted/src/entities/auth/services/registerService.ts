import { useMutation } from '@tanstack/react-query';
import api from '../../../shared/api/api';
import type { RegisterRequest, AuthResponse } from '../types';

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: RegisterRequest): Promise<AuthResponse> => {
      const { data } = await api.post('/auth/register', userData);
      const authData = data.data;
      
      // Guardar tokens en localStorage
      localStorage.setItem('access_token', authData.access_token);
      localStorage.setItem('refresh_token', authData.refresh_token);
      
      return authData;
    },
  });
};