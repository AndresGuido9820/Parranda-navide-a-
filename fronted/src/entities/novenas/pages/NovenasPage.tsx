import { Button, Card, CardBody } from '@heroui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../shared/layouts/MainLayout';

const daysData = [
  { day: 1, status: 'completed', title: 'La Anunciación' },
  { day: 2, status: 'completed', title: 'La Visitación' },
  { day: 3, status: 'completed', title: 'San José' },
  { day: 4, status: 'pending', title: 'La Esperanza' },
  { day: 5, status: 'pending', title: 'La Espera' },
  { day: 6, status: 'pending', title: 'María' },
  { day: 7, status: 'pending', title: 'Los Pastores' },
  { day: 8, status: 'pending', title: 'Los Reyes Magos' },
  { day: 9, status: 'pending', title: 'La Natividad' },
];

export const NovenasPage: React.FC = () => {
  const navigate = useNavigate();
  const completedDays = daysData.filter(d => d.status === 'completed').length;
  const progress = (completedDays / 9) * 100;

  const handleDayClick = (day: number) => {
    navigate(`/novenas/${day}`);
  };

  return (
    <MainLayout>
      <main className="w-full max-w-4xl mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-10">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-white">Novenas Navideñas</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-white/70">
              Sigue el camino de la fe y la tradición con nuestras novenas interactivas. 
              Cada día, una nueva oportunidad para conectar con el espíritu navideño.
            </p>
          </div>

          {/* Today's Novena Card */}
          <Card className="bg-transparent backdrop-blur-sm border border-white/30 rounded-xl shadow-lg">
            <CardBody className="p-6">
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-white">Hoy: Novena del Día 4</h3>
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-white/10 flex items-center justify-center">
                    <svg className="w-16 h-16 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <p className="font-bold text-xl mb-2 text-white">Día 4: La Esperanza</p>
                    <p className="text-sm text-white/70 mb-4">
                      Una reflexión sobre la esperanza que trae el nacimiento de Jesús, 
                      iluminando nuestros corazones en tiempos de oscuridad.
                    </p>
                    <div className="flex justify-center lg:justify-start items-center gap-2 text-xs font-semibold text-red-800">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Próximo día en 18 horas</span>
                    </div>
                  </div>
                  <Button 
                    className="flex-shrink-0 px-6 py-3 bg-red-600 text-white font-bold hover:bg-white/10 rounded-lg"
                    onClick={() => handleDayClick(4)}
                  >
                    Continuar Novena
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Progress Card */}
          <Card className="bg-transparent backdrop-blur-sm border border-white/30 rounded-xl shadow-lg">
            <CardBody className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-sm">
                  <p className="font-bold text-white">Progreso de la Novena</p>
                  <p className="font-semibold text-white">{completedDays}/9 Completados</p>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5">
                  <div 
                    className="bg-red-600 h-2.5 rounded-full transition-all" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Days Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {daysData.map((dayItem) => {
              const isCompleted = dayItem.status === 'completed';
              const isPending = dayItem.status === 'pending';

              return (
                <div
                  key={dayItem.day}
                  className={`bg-transparent backdrop-blur-sm border border-white/30 rounded-xl shadow-lg p-5 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                    isPending ? 'opacity-70' : ''
                  }`}
                  onClick={() => handleDayClick(dayItem.day)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-600/20'
                          : 'bg-white/10'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="text-3xl text-green-400">✓</span>
                      ) : (
                        <span className="text-2xl text-white/40">○</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-white">Día {dayItem.day}</p>
                      <p className="text-sm text-white/60">
                        {isCompleted ? 'Completado' : 'Pendiente'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </MainLayout>
  );
};
