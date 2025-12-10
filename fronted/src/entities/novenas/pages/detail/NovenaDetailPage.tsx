import { ChevronLeft, ChevronRight, BookOpen, Music, Snowflake } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';

import { CandleModal } from '../../../../shared/components/modals/CandleModal';
import { MainLayout } from '../../../../shared/layouts/MainLayout';
import { Skeleton } from '../../../../shared/components/skeletons/Skeleton';
import { useNovenaDay } from '../../hooks/useNovenaDay';
import {
  useMarkDayComplete,
  useNovenaProgress,
} from '../../hooks/useNovenaProgress';

export const NovenaDetailPage: React.FC = () => {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const dayNumber = day ? parseInt(day) : 1;

  const { data: novenaDay, isLoading, error } = useNovenaDay(dayNumber);
  const { data: progressData } = useNovenaProgress();
  const markComplete = useMarkDayComplete();

  const [isCandleModalOpen, setIsCandleModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('ORACION');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTransitionSkeleton, setShowTransitionSkeleton] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('right');

  // Reset transition state when day changes
  useEffect(() => {
    if (!isLoading && !showTransitionSkeleton) {
      setIsTransitioning(false);
    }
  }, [dayNumber, isLoading, showTransitionSkeleton]);

  // Check if this day is already completed
  const isCompleted =
    progressData?.progress?.find((p) => p.day_number === dayNumber)
      ?.is_completed ?? false;

  const handleBackToNovenas = () => {
    navigate('/novenas');
  };

  const handleLightCandles = () => {
    setIsCandleModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCandleModalOpen(false);
  };

  const handleNavigateToDay = (targetDay: number) => {
    setTransitionDirection(targetDay > dayNumber ? 'right' : 'left');
    setIsTransitioning(true);
    
    // Fade out current content
    setTimeout(() => {
      setShowTransitionSkeleton(true);
      navigate(`/novenas/${targetDay}`);
      
      // Show skeleton for 1.2 seconds for smooth transition
      setTimeout(() => {
        setShowTransitionSkeleton(false);
        setIsTransitioning(false);
      }, 1200);
    }, 300);
  };

  const handleContinue = async () => {
    if (!isCompleted) {
      await markComplete.mutateAsync(dayNumber);
    }
    setIsCandleModalOpen(false);

    // Navigate to next day or back to list with transition
    if (dayNumber < 9) {
      handleNavigateToDay(dayNumber + 1);
    } else {
      navigate('/novenas');
    }
  };

  // Group sections by type
  const sectionsByType = React.useMemo(() => {
    if (!novenaDay?.sections) return {};

    return novenaDay.sections.reduce(
      (acc, section) => {
        if (!acc[section.section_type]) {
          acc[section.section_type] = [];
        }
        acc[section.section_type].push(section);
        return acc;
      },
      {} as Record<string, typeof novenaDay.sections>
    );
  }, [novenaDay]);

  const sectionTypes = Object.keys(sectionsByType);
  const currentSections = sectionsByType[activeSection] ?? [];

  if (isLoading || showTransitionSkeleton) {
    return (
      <MainLayout showHeader={false}>
        <main className="flex flex-1 flex-col py-12 px-4 max-w-4xl mx-auto w-full animate-fade-in">
          <div className="flex flex-col gap-6">
            <Skeleton variant="text" height={40} width="70%" className="mb-2" />
            <Skeleton variant="text" height={20} width="50%" />
            <div className="flex gap-4 mt-4 justify-center">
              <Skeleton variant="rounded" height={40} width={100} />
              <Skeleton variant="rounded" height={40} width={100} />
              <Skeleton variant="rounded" height={40} width={100} />
            </div>
            <div className="bg-white/5 rounded-xl p-6 mt-6 space-y-4">
              <Skeleton variant="text" height={24} width="40%" />
              <Skeleton variant="text" height={16} width="100%" />
              <Skeleton variant="text" height={16} width="100%" />
              <Skeleton variant="text" height={16} width="80%" />
              <Skeleton variant="text" height={16} width="100%" />
              <Skeleton variant="text" height={16} width="60%" />
              <Skeleton variant="text" height={16} width="90%" />
              <Skeleton variant="text" height={16} width="100%" />
            </div>
            <div className="flex justify-center mt-6">
              <Skeleton variant="rounded" height={56} width={200} />
            </div>
          </div>
        </main>
      </MainLayout>
    );
  }

  if (error || !novenaDay) {
    return (
      <MainLayout showHeader={false}>
        <main className="flex flex-1 flex-col items-center justify-center py-24 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              Día no encontrado
            </h1>
            <button
              onClick={handleBackToNovenas}
              className="text-red-400 hover:text-red-300"
            >
              Volver a Novenas
            </button>
          </div>
        </main>
      </MainLayout>
    );
  }

  return (
    <MainLayout showHeader={false}>
      <header className="flex items-center justify-between whitespace-nowrap px-6 sm:px-10 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-red-600/20 p-2 rounded-xl border border-red-500/30 backdrop-blur-sm">
            <Snowflake className="text-red-500 w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Parranda Navideña</h2>
        </div>
        <div className="flex items-center gap-4">
          {isCompleted && (
            <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
              <span>✓</span> Completado
            </span>
          )}
          <button
            onClick={handleBackToNovenas}
            className="text-sm font-bold text-gray-300 hover:text-white transition-colors"
          >
            Volver a Novenas
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div 
          className={`w-full max-w-4xl mx-auto space-y-8 transition-all duration-300 ease-out ${
            isTransitioning 
              ? transitionDirection === 'right'
                ? 'opacity-0 -translate-x-8'
                : 'opacity-0 translate-x-8'
              : 'opacity-100 translate-x-0'
          }`}
        >
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Día {novenaDay.day_number}: {novenaDay.title}
            </h1>
            <p className="mt-2 text-lg text-red-400">
              Comencemos esta hermosa tradición con fe y alegría.
            </p>
          </div>

          {/* Section Tabs */}
          {sectionTypes.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2">
              {sectionTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveSection(type)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeSection === type
                      ? 'bg-red-600 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {type === 'ORACION' && <BookOpen className="w-4 h-4" />}
                  {type === 'GOZO' && <Music className="w-4 h-4" />}
                  {type === 'VILLANCICO' && <span>🎄</span>}
                  {type === 'ORACION'
                    ? 'Oración'
                    : type === 'GOZO'
                      ? 'Gozos'
                      : type === 'VILLANCICO'
                        ? 'Villancico'
                        : type}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
            {currentSections.map((section, idx) => (
              <div key={section.id} className={idx > 0 ? 'mt-8 pt-8 border-t border-white/10' : ''}>
                <div className="prose prose-invert prose-lg max-w-none">
                  <ReactMarkdown
                    components={{
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-bold text-white mb-4">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-semibold text-white/90 mb-3">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-white/80 leading-relaxed mb-4">
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong className="text-white font-bold">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="text-red-300 italic">{children}</em>
                      ),
                      hr: () => <hr className="border-white/20 my-6" />,
                    }}
                  >
                    {section.content_md}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            {dayNumber > 1 ? (
              <button
                onClick={() => handleNavigateToDay(dayNumber - 1)}
                disabled={isTransitioning}
                className="text-white/70 hover:text-white transition-all flex items-center gap-2 hover:scale-105 disabled:opacity-50 group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Día {dayNumber - 1}</span>
              </button>
            ) : (
              <div className="w-24" />
            )}

            <button
              onClick={handleLightCandles}
              disabled={isTransitioning}
              className="flex items-center justify-center gap-2 rounded-full h-14 px-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-base transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50"
            >
              <span className="text-xl">🕯️</span>
              <span>
                {isCompleted ? 'Prender velas de nuevo' : 'Prender velas'}
              </span>
            </button>

            {dayNumber < 9 ? (
              <button
                onClick={() => handleNavigateToDay(dayNumber + 1)}
                disabled={isTransitioning}
                className="text-white/70 hover:text-white transition-all flex items-center gap-2 hover:scale-105 disabled:opacity-50 group"
              >
                <span>Día {dayNumber + 1}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="w-24" />
            )}
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
