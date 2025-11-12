import { useLogin } from '../services/loginService';
import { useLogout } from '../services/logoutService';
import { useRegister } from '../services/registerService';
import type { User } from '../types';

export const useAuth = () => {
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const isAuthenticated = !!localStorage.getItem('access_token');

  // Extraer mensaje de error del login
  const getLoginError = (): string | null => {
    if (!loginMutation.error) return null;
    
    const error = loginMutation.error as any;
    // Intentar obtener el mensaje de error de la respuesta del backend
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

  return {
    // Estado del usuario
    user: null as User | null, // Por ahora sin usuario
    isAuthenticated,
    isLoading: false, // Por ahora sin loading
    error: getLoginError(),
    
    // Mutaciones
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    
    // Estados de las mutaciones
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};