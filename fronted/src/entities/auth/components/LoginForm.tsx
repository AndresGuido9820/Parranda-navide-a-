import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const navigate = useNavigate();
  const { login, isLoggingIn, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email no válido';
    }
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(formData);
      if (localStorage.getItem('access_token')) {
        navigate('/inicio');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Iniciar Sesión</h2>
        <p className="text-gray-400 text-sm">Ingresa tus credenciales para continuar.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="group relative">
          <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-red-400 transition-colors" />
          <input 
            type="email"
            name="email"
            placeholder="tucorreo@dominio.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoggingIn}
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
            placeholder="Escribe tu contraseña"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoggingIn}
            autoComplete="current-password"
            className={`w-full bg-black/40 border rounded-xl py-3 pl-10 pr-10 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all disabled:opacity-50 ${
              fieldErrors.password ? 'border-red-500' : 'border-gray-700/50'
            }`}
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoggingIn}
            className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors disabled:opacity-50"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
          {fieldErrors.password && (
            <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
          )}
        </div>

        {/* Olvidé contraseña */}
        <div className="flex justify-end">
          <a href="#" className="text-xs text-red-400 hover:text-red-300 transition-colors">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        {/* Error */}
        {error && (
          <div className="flex gap-3 p-4 rounded-lg bg-red-900/30 border border-red-500/50">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold text-red-400">Error al iniciar sesión</p>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Submit */}
        <button 
          type="submit"
          disabled={isLoggingIn}
          className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-900/30 hover:shadow-red-600/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Ingresando...</span>
            </>
          ) : (
            <>
              <span>Ingresar</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <p className="text-gray-400 text-sm">
          ¿No tienes cuenta?{' '}
          <button 
            type="button"
            onClick={onSwitchToRegister}
            disabled={isLoggingIn}
            className="text-white font-medium hover:underline decoration-red-500 underline-offset-4 disabled:opacity-50"
          >
            Regístrate
          </button>
        </p>
      </div>
    </>
  );
};
