import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CandleModal } from '../../../../shared/components/modals/CandleModal';
import { MainLayout } from '../../../../shared/layouts/MainLayout';

interface NovenaDay {
  day: number;
  title: string;
  content: string;
}

const novenaContent: { [key: number]: NovenaDay } = {
  1: {
    day: 1,
    title: 'Novena de Aguinaldos',
    content: 'En el primer día de la Novena de Aguinaldos, nos preparamos para recibir al Niño Jesús con corazones abiertos y llenos de esperanza. Reflexionamos sobre el significado de la Navidad y la importancia de la fe en nuestras vidas.',
  },
  2: {
    day: 2,
    title: 'La Visitación',
    content: 'En el segundo día, meditamos sobre la visitación de María a Isabel. Aprendemos sobre el amor fraterno y la generosidad que debemos tener con los demás, especialmente en esta época de Navidad.',
  },
  3: {
    day: 3,
    title: 'San José',
    content: 'El tercer día nos recuerda la figura de San José, el padre adoptivo de Jesús. Reflexionamos sobre su humildad, obediencia y amor desinteresado hacia María y el Niño Jesús.',
  },
  4: {
    day: 4,
    title: 'La Esperanza',
    content: 'Una reflexión sobre la esperanza que trae el nacimiento de Jesús, iluminando nuestros corazones en tiempos de oscuridad. La Navidad nos recuerda que siempre hay luz al final del camino.',
  },
  5: {
    day: 5,
    title: 'La Espera',
    content: 'Contemplamos el tiempo de espera antes del nacimiento de Cristo. Aprendemos a tener paciencia y a preparar nuestros corazones para recibir al Señor con alegría.',
  },
  6: {
    day: 6,
    title: 'María',
    content: 'Reflexionamos sobre la pureza y el amor de María, quien aceptó ser la madre del Salvador. Su ejemplo nos enseña a decir sí al plan de Dios en nuestras vidas.',
  },
  7: {
    day: 7,
    title: 'Los Pastores',
    content: 'Recordamos a los pastores que fueron los primeros en adorar al Niño Jesús. Ellos nos enseñan que Dios ama a los humildes y que la fe más simple puede ser la más grande.',
  },
  8: {
    day: 8,
    title: 'Los Reyes Magos',
    content: 'Meditamos sobre los Reyes Magos que viajaron desde lejos siguiendo la estrella. Su búsqueda del Salvador nos inspira a buscar a Dios en nuestra vida diaria.',
  },
  9: {
    day: 9,
    title: 'La Natividad',
    content: 'Celebramos el nacimiento de Jesús, el momento más importante de la historia. La Navidad nos recuerda el inmenso amor de Dios al enviarnos a su Hijo para nuestra salvación.',
  },
};

export const NovenaDetailPage: React.FC = () => {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const dayNumber = day ? parseInt(day) : 1;
  const novena = novenaContent[dayNumber];
  const [isCandleModalOpen, setIsCandleModalOpen] = useState(false);

  const handleBackToNovenas = () => {
    navigate('/novenas');
  };

  const handleLightCandles = () => {
    setIsCandleModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCandleModalOpen(false);
  };

  const handleContinue = () => {
    setIsCandleModalOpen(false);
    // Aquí podrías agregar lógica adicional como marcar el día como completado
  };

  return (
    <MainLayout showHeader={false}>
      <header className="flex items-center justify-between whitespace-nowrap px-10 py-4">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Navidad Mágica</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToNovenas}
            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary"
          >
            ← Volver a Novenas
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl space-y-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Día {novena.day}: {novena.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Comencemos esta hermosa tradición con fe y alegría.
          </p>

          <div className="mt-16">
            <p className="text-base leading-relaxed text-justify text-gray-700 dark:text-gray-300">
              {novena.content}
            </p>
          </div>

          <div className="mt-16 flex justify-center">
            <button 
              onClick={handleLightCandles}
              className="flex items-center justify-center gap-2 rounded-full h-12 px-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:bg-primary/10 dark:hover:bg-primary/20 text-gray-900 dark:text-white font-bold text-sm transition-colors"
            >
              <span className="material-symbols-outlined">flare</span>
              <span className="truncate">Prender velas</span>
            </button>
          </div>
        </div>
      </main>

      <CandleModal
        isOpen={isCandleModalOpen}
        onClose={handleCloseModal}
        onContinue={handleContinue}
      />
    </MainLayout>
  );
};

