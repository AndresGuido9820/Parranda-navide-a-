import React from 'react';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { ActivityCard } from '../components';

interface Activity {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: string;
  participants: string;
  age: string;
}

const activities: Activity[] = [
  {
    id: 1,
    title: 'Quema del Año Viejo',
    description: 'Ritual tradicional para cerrar ciclos y dar la bienvenida al nuevo año, con enfoque seguro y simbólico.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f29da2f084?w=800&q=80',
    duration: '25 min',
    participants: '2-20',
    age: '12+',
  },
  {
    id: 2,
    title: 'Encontrar al Niño Jesús',
    description: 'Búsqueda del tesoro temática: halla la figura del Niño Jesús siguiendo pistas por la casa.',
    image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80',
    duration: '15 min',
    participants: '2-12',
    age: '5+',
  },
];

export const DinamicasPage: React.FC = () => {
  const handleTryActivity = (activityId: number) => {
    console.log('Trying activity:', activityId);
  };

  return (
    <MainLayout>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dinámicas Navideñas</h1>
          <p className="text-white/70 text-lg">
            Juegos y actividades para compartir en familia y amigos. Elige una y ¡a jugar!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onTryActivity={() => handleTryActivity(activity.id)}
            />
          ))}
        </div>
      </main>
    </MainLayout>
  );
};
