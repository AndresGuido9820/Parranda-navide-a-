import { useState } from 'react';
import { Form, Input, Button, Checkbox, Link } from '@heroui/react';
import { useAuthWithQueries } from '../hooks/useAuthHook';
import type { LoginRequest } from '../types';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const { login, isLoggingIn, error, clearError } = useAuthWithQueries();
  const [action, setAction] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as unknown as LoginRequest;
    
    setAction(`submit ${JSON.stringify(data)}`);
    
    try {
      await login(data);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <Input
        isRequired
        errorMessage="Por favor ingresa un email válido"
        label="Correo"
        placeholder="tucorreo@dominio.com"
        type="email"
        name="email"
        disabled={isLoggingIn}
        startContent={
          <span className="text-default-400">✉️</span>
        }
      />

      <Input
        isRequired
        errorMessage="Por favor ingresa tu contraseña"
        label="Contraseña"
        placeholder="••••••••"
        type="password"
        name="password"
        disabled={isLoggingIn}
        startContent={
          <span className="text-default-400">🔒</span>
        }
        endContent={
          <button type="button" className="text-default-400 hover:text-default-600">
            👁️
          </button>
        }
      />

      <div className="flex items-center justify-between">
        <Checkbox
          name="rememberMe"
          color="danger"
          disabled={isLoggingIn}
        >
          Recuérdame
        </Checkbox>
        
        <Link
          size="sm"
          color="danger"
          className="cursor-pointer"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
      
      {error && (
        <div className="text-danger text-sm text-center bg-danger-50 p-3 rounded-lg border border-danger-200">
          {error}
        </div>
      )}
      
      <div className="flex gap-2 justify-end">
        <Button 
          color="danger" 
          type="submit"
          fullWidth
          isLoading={isLoggingIn}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Iniciando sesión...' : 'Ingresar'}
        </Button>
      </div>
      
      {action && (
        <div className="text-small text-default-500">
          Action: <code>{action}</code>
        </div>
      )}
      
      <p className="text-center text-small text-gray-300">
        ¿No tienes cuenta?{" "}
        <Link 
          size="sm" 
          color="danger"
          onPress={onSwitchToRegister}
          className="cursor-pointer"
        >
          Regístrate
        </Link>
      </p>
    </Form>
  );
};