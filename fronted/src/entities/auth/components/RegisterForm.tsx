import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { RegisterRequest } from '../types';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const { register: registerUser, isRegistering, registerError } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      errors.full_name = 'El nombre es requerido';
    } else if (formData.full_name.trim().length < 3) {
      errors.full_name = 'Mínimo 3 caracteres';
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email no válido';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'Mínimo 6 caracteres';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage('');
    if (!validateForm()) return;

    try {
      const { confirmPassword, ...userData } = formData;
      await registerUser(userData as RegisterRequest);
      setSuccessMessage('¡Cuenta creada! Redirigiendo...');
      setFormData({ full_name: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => onSwitchToLogin(), 2000);
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Únete a la fiesta</h2>
        <p className="text-gray-400 text-sm">Completa el formulario para empezar.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="group relative">
          <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-red-400 transition-colors" />
          <input 
            type="text"
            name="full_name"
            placeholder="Tu nombre completo"
            value={formData.full_name}
            onChange={handleChange}
            disabled={isRegistering}
            autoComplete="name"
            className={`w-full bg-black/40 border rounded-xl py-3 pl-10 pr-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all disabled:opacity-50 ${
              fieldErrors.full_name ? 'border-red-500' : 'border-gray-700/50'
            }`}
          />
          {fieldErrors.full_name && (
            <p className="text-red-400 text-xs mt-1">{fieldErrors.full_name}</p>
          )}
        </div>

        {/* Email */}
        <div className="group relative">
          <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-red-400 transition-colors" />
          <input 
            type="email"
            name="email"
            placeholder="tucorreo@dominio.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isRegistering}
            autoComplete="email"
            className={`w-full bg-black/40 border rounded-xl py-3 pl-10 pr-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all disabled:opacity-50 ${
              fieldErrors.email ? 'border-red-500' : 'border-gray-700/50'
            }`}
          />
          {fieldErrors.email && (
            <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="group relative">
          <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-red-400 transition-colors" />
          <input 
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={handleChange}
            disabled={isRegistering}
            autoComplete="new-password"
            className={`w-full bg-black/40 border rounded-xl py-3 pl-10 pr-10 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all disabled:opacity-50 ${
              fieldErrors.password ? 'border-red-500' : 'border-gray-700/50'
            }`}
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isRegistering}
            className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors disabled:opacity-50"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
          {fieldErrors.password && (
            <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="group relative">
          <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-red-400 transition-colors" />
          <input 
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirma tu contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isRegistering}
            autoComplete="new-password"
            className={`w-full bg-black/40 border rounded-xl py-3 pl-10 pr-10 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all disabled:opacity-50 ${
              fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-700/50'
            }`}
          />
          <button 
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isRegistering}
            className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors disabled:opacity-50"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
          {fieldErrors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        {/* Error */}
        {registerError && (
          <div className="flex gap-3 p-4 rounded-lg bg-red-900/30 border border-red-500/50">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold text-red-400">Error en el registro</p>
              <p className="text-sm text-red-300">{registerError}</p>
            </div>
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div className="flex gap-3 p-4 rounded-lg bg-green-900/30 border border-green-500/50">
            <span className="text-xl">✅</span>
            <div>
              <p className="font-semibold text-green-400">¡Éxito!</p>
              <p className="text-sm text-green-300">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Submit */}
        <button 
          type="submit"
          disabled={isRegistering}
          className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-900/30 hover:shadow-red-600/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRegistering ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registrando...</span>
            </>
          ) : (
            <>
              <span>Registrarse</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <p className="text-gray-400 text-sm">
          ¿Ya tienes cuenta?{' '}
          <button 
            type="button"
            onClick={onSwitchToLogin}
            disabled={isRegistering}
            className="text-white font-medium hover:underline decoration-red-500 underline-offset-4 disabled:opacity-50"
          >
            Inicia Sesión
          </button>
        </p>
      </div>
    </>
  );
};
