import { Button, Form, Input, Link } from '@heroui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const navigate = useNavigate();
  const { login, isLoggingIn, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage('');

    try {
      await login(formData);
      setSuccessMessage('¡Sesión iniciada correctamente!');
      
      // Redirigir a inicio
      navigate('/inicio');
    } catch (error) {
      console.error('Login error:', error);
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
        <h2 className="text-2xl font-bold text-default-700">Iniciar Sesión</h2>
        <p className="text-small text-default-500 mt-1">
          Los campos marcados con <span className="text-danger">*</span> son obligatorios
        </p>
      </div>

      {/* Email */}
      <Input
        isRequired
        label="Correo"
        placeholder="tucorreo@dominio.com"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        autoComplete="email"
        disabled={isLoggingIn}
      />

      {/* Contraseña con ícono mostrar/ocultar */}
      <div className="flex flex-row gap-2">
        <Input
          isRequired
          label="Contraseña"
          autoComplete="current-password"
          type={passwordVisible ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Escribe tu contraseña"
          disabled={isLoggingIn}
          className="flex-1"
        />
        <button
          type="button"
          className="text-default-400 hover:text-default-600 self-end pb-2"
          onClick={() => setPasswordVisible(!passwordVisible)}
          tabIndex={-1}
        >
          {passwordVisible ? '🙈' : '👁️'}
        </button>
      </div>

      {/* Mensaje de Error del Backend */}
      {error && (
        <div className="animate-in fade-in duration-300 flex gap-3 p-4 rounded-lg bg-danger-50 border border-danger-200">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-danger-700">Error al iniciar sesión</p>
            <p className="text-small text-danger-600">{error}</p>
          </div>
        </div>
      )}

      {/* Mensaje de Éxito */}
      {successMessage && (
        <div className="animate-in fade-in duration-300 flex gap-3 p-4 rounded-lg bg-success-50 border border-success-200">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-success-700">¡Bienvenido!</p>
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
        isLoading={isLoggingIn}
        disabled={isLoggingIn}
        className="font-semibold"
      >
        {isLoggingIn ? 'Iniciando sesión...' : 'Ingresar'}
      </Button>

      {/* Link a Registro */}
      <p className="text-center text-small text-gray-300">
        ¿No tienes cuenta?{' '}
        <Link
          size="sm"
          color="danger"
          onPress={onSwitchToRegister}
          className="cursor-pointer font-semibold"
        >
          Regístrate
        </Link>
      </p>
    </Form>
  );
};