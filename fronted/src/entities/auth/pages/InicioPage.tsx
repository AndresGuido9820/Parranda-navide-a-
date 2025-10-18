import React from 'react';
import { Button, Card, CardBody, CardHeader, User } from '@heroui/react';
import { useAuth } from '../hooks/useAuthHook';

export const InicioPage: React.FC = () => {
  const { user, logout } = useAuth();

  const cardsData = [
    {
      title: 'Novenas',
      description: 'Reza las novenas navideñas y lleva un seguimiento de tu progreso.',
      icon: '🎄',
      color: 'bg-green-500',
      link: '/novenas'
    },
    {
      title: 'Recetas',
      description: 'Descubre recetas tradicionales para la época navideña.',
      icon: '🍔',
      color: 'bg-red-500',
      link: '/recetas'
    },
    {
      title: 'Música',
      description: 'Disfruta de la música navideña tradicional.',
      icon: '🎵',
      color: 'bg-blue-500',
      link: '/musica'
    },
    {
      title: 'Dinámicas',
      description: 'Crea dinámicas y sorteos familiares.',
      icon: '🎉',
      color: 'bg-purple-500',
      link: '/dinamicas'
    }
  ]

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

        <div className="grid grid-cols-1 w-120 md:grid-cols-2 lg:flex lg:flex-wrap gap-4">
          {
            cardsData.map((card) => (
              <Card className="hover:shadow-lg transition-shadow cursor-pointer px-4 py-2 bg-blue-500/10 rounded-2xl">
                <CardHeader>
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-600">{card.description}</p>
                </CardBody>
                <Button color="primary" className="my-4">
                  Ver {card.title}
                </Button>
              </Card>
            ))
          }
        </div>
      </div>
    </div>
  );
};
