import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useCurrentUser, useLogin, useRegister, useLogout } from './useAuthQueries';
import type { AuthContextType } from '../types';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook que combina React Query con el contexto
export const useAuthWithQueries = () => {
  const { user, isAuthenticated, isLoading, error, clearError } = useAuth();
  const currentUserQuery = useCurrentUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  return {
    // Estado del contexto
    user: user || currentUserQuery.data,
    isAuthenticated: isAuthenticated || !!currentUserQuery.data,
    isLoading: isLoading || currentUserQuery.isLoading,
    error: error || currentUserQuery.error?.message,
    clearError,
    
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
