import React from 'react';
import { Button, Card, CardBody, CardHeader, User } from '@heroui/react';
import { useAuth } from '../hooks/useAuthHook';

export const InicioPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Parranda Navideña
          </h1>
          <div className="flex items-center gap-4">
            <User
              name={user?.full_name || user?.alias || 'Usuario'}
              description={user?.email}
              avatarProps={{
                src: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'U')}&background=random`,
              }}
            />
            <Button
              color="danger"
              variant="light"
              onPress={logout}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <h3 className="text-xl font-semibold">Novenas</h3>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600">
                Reza las novenas navideñas y lleva un seguimiento de tu progreso.
              </p>
              <Button color="primary" className="mt-4">
                Ver Novenas
              </Button>
            </CardBody>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <h3 className="text-xl font-semibold">Recetas</h3>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600">
                Descubre recetas tradicionales para la época navideña.
              </p>
              <Button color="secondary" className="mt-4">
                Ver Recetas
              </Button>
            </CardBody>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <h3 className="text-xl font-semibold">Música</h3>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600">
                Disfruta de la música navideña tradicional.
              </p>
              <Button color="success" className="mt-4">
                Escuchar Música
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
