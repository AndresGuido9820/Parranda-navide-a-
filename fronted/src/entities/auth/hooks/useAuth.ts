import { useLogin } from '../services/loginService';
import { useRegister } from '../services/registerService';
import { useLogout } from '../services/logoutService';
import type { User } from '../types';

export const useAuth = () => {
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const isAuthenticated = !!localStorage.getItem('access_token');

  return {
    // Estado del usuario
    user: null as User | null, // Por ahora sin usuario
    isAuthenticated,
    isLoading: false, // Por ahora sin loading
    error: null as string | null, // Por ahora sin error
    
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