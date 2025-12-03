import { useMutation } from '@tanstack/react-query';
import api from '../../../shared/api/api';
import type { RegisterRequest } from '../types';

interface RegisterResponse {
  success: boolean;
  message: string;
}

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: RegisterRequest): Promise<RegisterResponse> => {
      const { data } = await api.post('/auth/register', userData);
      // NO guardamos tokens - el usuario debe ir a login
      return {
        success: data.success,
        message: data.message || 'Usuario registrado exitosamente',
      };
    },
  });
};
