import { Button, Card, CardBody } from '@heroui/react';
import { Check, Circle, Flame } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { MainLayout } from '../../../shared/layouts/MainLayout';
import { NovenaDaySkeleton, Skeleton } from '../../../shared/components/skeletons/Skeleton';
import { useNovenas } from '../hooks/useNovenas';
import { useNovenaProgress } from '../hooks/useNovenaProgress';

export const NovenasPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: novenasData, isLoading: isLoadingDays } = useNovenas();
  const { data: progressData, isLoading: isLoadingProgress } =
    useNovenaProgress();

  const isLoading = isLoadingDays || isLoadingProgress;

  // Combine days with progress
  const daysWithProgress = React.useMemo(() => {
    if (!novenasData?.days) return [];

    const progressMap = new Map(
      progressData?.progress?.map((p) => [p.day_number, p]) ?? []
    );

    return novenasData.days.map((day) => ({
      ...day,
      isCompleted: progressMap.get(day.day_number)?.is_completed ?? false,
      completedAt: progressMap.get(day.day_number)?.completed_at ?? null,
    }));
  }, [novenasData, progressData]);

  const completedCount = progressData?.completed_count ?? 0;
  const totalDays = progressData?.total_days ?? 9;
  const progress = (completedCount / totalDays) * 100;

  // Find the current day (first incomplete or last completed + 1)
  const currentDayNumber = React.useMemo(() => {
    const firstIncomplete = daysWithProgress.find((d) => !d.isCompleted);
    return firstIncomplete?.day_number ?? 9;
  }, [daysWithProgress]);

  const currentDay = daysWithProgress.find(
    (d) => d.day_number === currentDayNumber
  );

  const handleDayClick = (day: number) => {
    navigate(`/novenas/${day}`);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <main className="w-full max-w-4xl mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col gap-8">
            <div className="text-center space-y-4">
              <Skeleton variant="text" height={40} width="60%" className="mx-auto" />
              <Skeleton variant="text" height={20} width="80%" className="mx-auto" />
            </div>
            <div className="bg-white/5 rounded-xl p-6 space-y-4">
              <Skeleton variant="text" height={24} width="40%" />
              <Skeleton variant="rounded" height={12} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <NovenaDaySkeleton key={i} />
              ))}
            </div>
          </div>
        </main>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="w-full max-w-4xl mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-10">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-white">
              Novenas Navideñas
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-white/70">
              Sigue el camino de la fe y la tradición con nuestras novenas
              interactivas. Cada día, una nueva oportunidad para conectar con el
              espíritu navideño.
            </p>
          </div>

          {/* Today's Novena Card */}
          {currentDay && (
            <Card className="bg-transparent backdrop-blur-sm border border-white/30 rounded-xl shadow-lg">
              <CardBody className="p-6">
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-bold text-white">
                    {completedCount === 9
                      ? '¡Novena Completada! 🎄'
                      : `Hoy: Novena del Día ${currentDayNumber}`}
                  </h3>
                  <div className="flex flex-col lg:flex-row items-center gap-6">
                    <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-white/10 flex items-center justify-center">
                      {completedCount === 9 ? (
                        <span className="text-5xl">🌟</span>
                      ) : (
                        <svg
                          className="w-16 h-16 text-red-800"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 text-center lg:text-left">
                      <p className="font-bold text-xl mb-2 text-white">
                        Día {currentDay.day_number}: {currentDay.title}
                      </p>
                      <p className="text-sm text-white/70 mb-4">
                        {completedCount === 9
                          ? '¡Felicidades! Has completado todas las novenas. Que el espíritu navideño permanezca en tu corazón.'
                          : 'Continúa tu camino de fe con la novena de hoy.'}
                      </p>
                      {completedCount < 9 && (
                        <div className="flex justify-center lg:justify-start items-center gap-2 text-xs font-semibold text-red-400">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            {completedCount} de 9 días completados
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      className="flex-shrink-0 px-6 py-3 bg-red-600 text-white font-bold hover:bg-red-700 rounded-lg"
                      onClick={() => handleDayClick(currentDayNumber)}
                    >
                      {completedCount === 9
                        ? 'Ver Novenas'
                        : 'Continuar Novena'}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Progress Card */}
          <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-2xl shadow-lg overflow-hidden">
            <CardBody className="p-6">
              <div className="flex flex-col gap-5">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500/20 p-2 rounded-lg border border-red-500/30">
                      <Flame className="w-5 h-5 text-orange-400" />
                    </div>
                    <p className="font-bold text-white text-lg">Tu Progreso</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                    <span className="text-2xl font-bold text-white">{completedCount}</span>
                    <span className="text-white/50">/</span>
                    <span className="text-white/70">{totalDays}</span>
                  </div>
                </div>

                {/* Candle Progress Bar */}
                <div className="relative">
                  {/* Background track */}
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-orange-500 via-red-500 to-red-600"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  {/* Candle markers */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-1">
                    {[...Array(9)].map((_, i) => {
                      const isLit = i < completedCount;
                      return (
                        <div
                          key={i}
                          className={`relative w-2 h-2 rounded-full transition-all duration-300 ${
                            isLit 
                              ? 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]' 
                              : 'bg-white/30'
                          }`}
                        >
                          {isLit && (
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status text */}
                <div className="flex justify-between items-center text-sm">
                  <p className="text-white/60">
                    {completedCount === 0 
                      ? '¡Comienza tu camino de fe!'
                      : completedCount === 9
                        ? '🎄 ¡Novena completada!'
                        : `${9 - completedCount} días restantes`}
                  </p>
                  <p className="text-orange-400 font-semibold">
                    {Math.round(progress)}% completado
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Days Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {daysWithProgress.map((dayItem) => {
              const isCompleted = dayItem.isCompleted;
              const isCurrent = dayItem.day_number === currentDayNumber;

              return (
                <div
                  key={dayItem.id}
                  className={`group relative bg-gradient-to-br backdrop-blur-sm border rounded-2xl shadow-lg p-5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden ${
                    isCurrent
                      ? 'from-red-950/60 to-red-900/40 border-red-500 ring-2 ring-red-500/50 shadow-red-500/20'
                      : isCompleted
                        ? 'from-green-950/40 to-green-900/20 border-green-500/50 shadow-green-500/10'
                        : 'from-white/5 to-white/0 border-white/20 opacity-80 hover:opacity-100'
                  }`}
                  onClick={() => handleDayClick(dayItem.day_number)}
                >
                  {/* Glow effect for current */}
                  {isCurrent && (
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/20 rounded-full blur-2xl" />
                  )}
                  
                  <div className="relative flex items-center gap-4">
                    <div
                      className={`relative flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-gradient-to-br from-green-500/30 to-green-600/20 border border-green-500/30' 
                          : isCurrent
                            ? 'bg-gradient-to-br from-orange-500/30 to-red-600/20 border border-orange-500/30'
                            : 'bg-white/10 border border-white/10'
                      }`}
                    >
                      {isCompleted ? (
                        <div className="bg-green-500 rounded-full p-1.5">
                          <Check className="w-5 h-5 text-white" strokeWidth={3} />
                        </div>
                      ) : isCurrent ? (
                        <div className="relative flex flex-col items-center">
                          <Flame className="w-7 h-7 text-orange-400 animate-pulse" />
                          <div className="absolute -bottom-1 w-3 h-4 bg-gradient-to-t from-amber-200 to-transparent rounded-b-full opacity-80" />
                        </div>
                      ) : (
                        <Circle className="w-6 h-6 text-white/30" strokeWidth={1.5} />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-lg text-white">
                          Día {dayItem.day_number}
                        </p>
                        {isCompleted && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/60 truncate">{dayItem.title}</p>
                      <p className={`text-xs mt-1 font-medium ${
                        isCompleted
                          ? 'text-green-400'
                          : isCurrent
                            ? 'text-orange-400'
                            : 'text-white/40'
                      }`}>
                        {isCompleted
                          ? '🎄 Completado'
                          : isCurrent
                            ? '🔥 En progreso'
                            : 'Pendiente'}
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
