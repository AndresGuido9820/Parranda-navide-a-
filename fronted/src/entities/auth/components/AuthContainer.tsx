import { Card, CardBody, Tab, Tabs } from '@heroui/react';
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

type AuthMode = 'login' | 'register';

export const AuthContainer = () => {
  const [selected, setSelected] = useState<AuthMode>('login');

  const switchToLogin = () => setSelected('login');
  const switchToRegister = () => setSelected('register');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-800 flex">
      {/* Left Panel - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-900/20 to-gray-800/40 p-12 items-center justify-center">
        <div className="max-w-md">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-xl">❄️</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Parranda Navideña</h1>
          </div>
          
          <h2 className="text-red-400 text-sm font-semibold uppercase tracking-wider mb-4">
            BIENVENIDO
          </h2>
          
          <h3 className="text-4xl font-bold text-white mb-6">
            Celebra la temporada
          </h3>
          
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Ingresa o crea tu cuenta para acceder a novenas, recetas y dinámicas navideñas. 
            Comparte momentos, listas y música con tu familia y amigos.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-gray-300">Guarda tu progreso en las novenas.</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-gray-300">Comparte recetas y fotos.</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-gray-300">Crea dinámicas y sorteos familiares.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="bg-gray-800/50 backdrop-blur-sm shadow-2xl border border-gray-700/50">
            <CardBody className="overflow-hidden ">
              <Tabs
                fullWidth
                aria-label="Tabs form"
                selectedKey={selected}
                size="md"
                onSelectionChange={(key) => setSelected(key as AuthMode)}
                classNames={{
                  tabList: "bg-gray-700/50 p-1 rounded-lg justify-center items-center",
                  tab: "text-gray-400 data-[selected=true]:text-white data-[selected=true]:bg-gray-500",
                  cursor: "hidden",
                  tabContent: "text-sm font-medium",
                  base: "pr-2 w-full items-center justify-center"
                }}
              >
                <Tab key="login" title="Ingresar">
                  <LoginForm onSwitchToRegister={switchToRegister} />
                </Tab>
                
                <Tab key="register" title="Crear cuenta">
                  <RegisterForm onSwitchToLogin={switchToLogin} />
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
          
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              © Parranda Navideña - Hecho con ♥
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
