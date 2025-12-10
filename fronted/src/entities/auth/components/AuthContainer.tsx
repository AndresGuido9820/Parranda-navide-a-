import { CalendarHeart, Gift, Music, Snowflake } from 'lucide-react';
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

// Componente de animación de nieve
const Snowfall = () => {
  const snowflakes = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 10 + 10}s`,
    animationDelay: `${Math.random() * 10}s`,
    opacity: Math.random() * 0.5 + 0.1,
    size: `${Math.random() * 0.4 + 0.1}rem`,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full animate-snowfall"
          style={{
            left: flake.left,
            top: '-10px',
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

type AuthMode = 'login' | 'register';

export const AuthContainer = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const benefits = [
    { icon: CalendarHeart, text: "Guarda tu progreso en las novenas." },
    { icon: Gift, text: "Comparte recetas y fotos exclusivas." },
    { icon: Music, text: "Crea dinámicas y sorteos familiares." }
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_#7f1d1d,_#020617,_#000000)] text-white selection:bg-red-500 selection:text-white overflow-hidden relative">
      
      <Snowfall />

      {/* Elementos decorativos de fondo (brillos) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 relative z-10">
        
        {/* LADO IZQUIERDO: Hero / Información */}
        <div className="w-full md:w-1/2 flex flex-col space-y-8 max-w-lg animate-fade-in-up">
          
          {/* Logo y Marca */}
          <div className="flex items-center space-x-3">
            <div className="bg-red-600/20 p-2.5 rounded-xl border border-red-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              <Snowflake className="text-red-500 w-8 h-8" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Parranda Navideña
            </span>
          </div>

          {/* Títulos */}
          <div className="space-y-4">
            <span className="inline-block py-1 px-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold tracking-wider uppercase">
              Bienvenido
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Celebra la <br/>
              <span className="text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.6)]">temporada.</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Ingresa o crea tu cuenta para acceder a novenas, recetas y dinámicas navideñas. 
              Comparte momentos, listas y música con tu familia y amigos.
            </p>
          </div>

          {/* Lista de beneficios */}
          <ul className="space-y-4 pt-4 hidden md:block">
            {benefits.map((item, idx) => (
              <li key={idx} className="flex items-center space-x-4 group">
                <div className="p-2 rounded-full bg-gray-800/50 group-hover:bg-red-900/30 transition-colors duration-300">
                  <item.icon className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* LADO DERECHO: Formulario (Card) */}
        <div className="w-full md:w-[420px] animate-fade-in-up delay-100">
          <div className="relative group">
            {/* Borde brillante animado detrás de la tarjeta */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            
            <div className="relative bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              
              {/* Toggle: Login vs Crear Cuenta */}
              <div className="flex bg-black/40 p-1 rounded-lg mb-8 border border-white/5">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    mode === 'login' 
                      ? 'bg-gray-800 text-white shadow-lg shadow-black/50' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Ingresar
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    mode === 'register' 
                      ? 'bg-gray-800 text-white shadow-lg shadow-black/50' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Crear cuenta
                </button>
              </div>

              {/* Form */}
              {mode === 'login' ? (
                <LoginForm onSwitchToRegister={() => setMode('register')} />
              ) : (
                <RegisterForm onSwitchToLogin={() => setMode('login')} />
              )}

              <div className="mt-6 flex justify-center items-center text-[10px] text-gray-600 gap-1">
                <span>© Parranda Navideña</span>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span>Hecho con ❤️</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        @keyframes snowfall {
          0% {
            transform: translateY(-10px) translateX(0);
          }
          50% {
            transform: translateY(50vh) translateX(10px);
          }
          100% {
            transform: translateY(105vh) translateX(-10px);
          }
        }
        .animate-snowfall {
          animation-name: snowfall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};
