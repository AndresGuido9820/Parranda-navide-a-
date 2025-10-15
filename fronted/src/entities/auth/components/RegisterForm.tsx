import { useState } from 'react';
import { Form, Input, Button, Link } from '@heroui/react';
import { useAuthWithQueries } from '../hooks/useAuthHook';
import type { RegisterRequest } from '../types';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const { register: registerUser, isRegistering, error, clearError } = useAuthWithQueries();
  const [action, setAction] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    // Validar que las contraseñas coincidan
    if (data.password !== data.confirmPassword) {
      console.error('Las contraseñas no coinciden');
      return;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userData } = data;
    
    setAction(`submit ${JSON.stringify(userData)}`);
    
    try {
      await registerUser(userData as unknown as RegisterRequest);
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <Form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <Input
        isRequired
        errorMessage="Por favor ingresa tu nombre completo"
        label="Nombre Completo"
        placeholder="Tu nombre completo"
        type="text"
        name="full_name"
        disabled={isRegistering}
        startContent={
          <span className="text-default-400">👤</span>
        }
      />

      <Input
        isRequired
        errorMessage="Por favor ingresa un email válido"
        label="Correo"
        placeholder="tucorreo@dominio.com"
        type="email"
        name="email"
        disabled={isRegistering}
        startContent={
          <span className="text-default-400">✉️</span>
        }
      />

      <Input
        isRequired
        errorMessage="La contraseña debe tener al menos 6 caracteres"
        label="Contraseña"
        placeholder="Mínimo 6 caracteres"
        type="password"
        name="password"
        disabled={isRegistering}
        startContent={
          <span className="text-default-400">🔒</span>
        }
      />

      <Input
        isRequired
        errorMessage="Las contraseñas no coinciden"
        label="Confirmar Contraseña"
        placeholder="Repite tu contraseña"
        type="password"
        name="confirmPassword"
        disabled={isRegistering}
        startContent={
          <span className="text-default-400">🔒</span>
        }
      />
      
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
          isLoading={isRegistering}
          disabled={isRegistering}
        >
          {isRegistering ? 'Creando cuenta...' : 'Crear Cuenta'}
        </Button>
      </div>
      
      {action && (
        <div className="text-small text-default-500">
          Action: <code>{action}</code>
        </div>
      )}
      
      <p className="text-center text-small text-gray-300">
        ¿Ya tienes una cuenta?{" "}
        <Link 
          size="sm" 
          color="danger"
          onPress={onSwitchToLogin}
          className="cursor-pointer"
        >
          Inicia sesión
        </Link>
      </p>
    </Form>
  );
};