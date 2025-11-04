import { Button, Form, Input, Link, Spinner } from '@heroui/react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { RegisterRequest } from '../types';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const { register: registerUser, isRegistering, error } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateField = (name: string, value: string): string => {
    const errors: Record<string, string> = {};

    switch (name) {
      case 'full_name':
        if (!value.trim()) {
          errors.full_name = 'El nombre completo es requerido';
        } else if (value.trim().length < 3) {
          errors.full_name = 'El nombre debe tener al menos 3 caracteres';
        }
        break;

      case 'email':
        if (!value.trim()) {
          errors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Email no válido';
        }
        break;

      case 'password':
        if (!value) {
          errors.password = 'La contraseña es requerida';
        } else if (value.length < 6) {
          errors.password = 'Mínimo 6 caracteres';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = 'Confirmar contraseña es requerido';
        } else if (value !== formData.password) {
          errors.confirmPassword = 'Las contraseñas no coinciden';
        }
        break;
    }

    return errors[name] || '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error si el usuario empieza a escribir
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(
        key,
        formData[key as keyof typeof formData]
      );
      if (error) errors[key] = error;
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage('');

    // Validar antes de enviar
    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await registerUser(userData as unknown as RegisterRequest);
      setSuccessMessage('¡Cuenta creada exitosamente! Redirigiendo...');
      setFormData({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setFieldErrors({});
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <Form
      className="flex flex-col gap-6"
      autoComplete="on"
      onSubmit={handleSubmit}
    >
      {/* Título */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-default-700">Crear Cuenta</h2>
        <p className="text-small text-default-500 mt-1">
          Los campos marcados con <span className="text-danger">*</span> son
          obligatorios
        </p>
      </div>

      {/* Nombre Completo */}
      <div>
        <Input
          isRequired
          isInvalid={!!fieldErrors.full_name}
          errorMessage={fieldErrors.full_name}
        
          placeholder="Tu nombre completo"
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          autoComplete="name"
          disabled={isRegistering}
          classNames={{
            errorMessage: 'text-red-600 font-bold text-base',
          }}
        />
      </div>

      {/* Email */}
      <div>
        <Input
          isRequired
          isInvalid={!!fieldErrors.email}
          errorMessage={fieldErrors.email}
      
          placeholder="tucorreo@dominio.com"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          disabled={isRegistering}
          classNames={{
            errorMessage: 'text-red-600 font-bold text-base',
          }}
        />
      </div>

      {/* Contraseña */}
      <div>
        <Input
          isRequired
          isInvalid={!!fieldErrors.password}
          errorMessage={fieldErrors.password}
       
          placeholder="Mínimo 6 caracteres"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          disabled={isRegistering}
          endContent={<span className="text-default-400">🔒</span>}
          classNames={{
            errorMessage: 'text-red-600 font-bold text-base',
          }}
        />
      </div>

      {/* Confirmar Contraseña */}
      <div>
        <Input
          isRequired
          isInvalid={!!fieldErrors.confirmPassword}
          errorMessage={fieldErrors.confirmPassword}
         
          placeholder="Repite tu contraseña"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          disabled={isRegistering}
          endContent={<span className="text-default-400">🔒</span>}
          classNames={{
            errorMessage: 'text-red-600 font-bold text-base',
          }}
        />
      </div>

      {/* Mensaje de Error del Backend */}
      {error && (
        <div className="animate-in fade-in duration-300 flex gap-3 p-4 rounded-lg bg-red-100 border-2 border-red-600">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-bold text-red-700">Error en el registro</p>
            <p className="text-sm text-red-700 font-semibold">{error}</p>
          </div>
        </div>
      )}

      {/* Mensaje de Éxito */}
      {successMessage && (
        <div className="animate-in fade-in duration-300 flex gap-3 p-4 rounded-lg bg-success-50 border border-success-200">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-success-700">¡Registro exitoso!</p>
            <p className="text-small text-success-600">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Botón Enviar */}
      <Button
        color="danger"
        type="submit"
        fullWidth
        size="lg"
        isLoading={isRegistering}
        disabled={isRegistering}
        className="font-semibold"
        spinner={<Spinner size="sm" color="white" />}
      >
        {isRegistering ? 'Creando cuenta...' : 'Crear Cuenta'}
      </Button>

      {/* Link a Login */}
      <p className="text-center text-small text-gray-300">
        ¿Ya tienes una cuenta?{' '}
        <Link
          size="sm"
          color="danger"
          onPress={onSwitchToLogin}
          className={`cursor-pointer font-semibold ${isRegistering ? 'opacity-50 pointer-events-none' : ''}`}
          isDisabled={isRegistering}
        >
          Inicia sesión
        </Link>
      </p>
    </Form>
  );
};