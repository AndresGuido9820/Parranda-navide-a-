import { useMutation } from '@tanstack/react-query';
import api from '../../../shared/api/api';

export const useLogout = () => {
  return useMutation({
    mutationFn: async (): Promise<void> => {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.error('Error during server logout:', error);
      } finally {
        // Limpiar tokens del localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    },
  });
};