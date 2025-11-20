import React from 'react';
import { useNavigate } from 'react-router-dom';
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
    description: 'Ritual tradicional para cerrar ciclos y dar la bienvenida al nuevo año, sumérgete en la experiencia y revive momentos!',
    image: 'https://i.ibb.co/sdKDg1wg/Gemini-Generated-Image-9gskg59gskg59gsk-1.png',
    duration: '25 min',
    participants: '2-20',
    age: '12+',
  },
  {
    id: 2,
    title: 'Encontrar al Niño Jesús',
    description: 'Búsqueda del tesoro temática: halla la figura del Niño Jesús siguiendo pistas por la casa.',
    image: 'https://i.ibb.co/RTSzq3Kt/Gemini-Generated-Image-ctr8qmctr8qmctr8.png',
    duration: '15 min',
    participants: '2-12',
    age: '5+',
  },
];

export const DinamicasPage: React.FC = () => {
  const navigate = useNavigate();

  const handleTryActivity = (activityId: number) => {
    if (activityId === 1) {
      navigate('/dinamicas/ano-viejo');
    } else if (activityId === 2) {
      navigate('/dinamicas/nino-jesus');
    } else {
      console.log('Trying activity:', activityId);
    }
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
