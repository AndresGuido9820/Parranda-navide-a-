import React, { useRef } from 'react';
import type { UseMusicPlayerReturn } from '../hooks/useMusicPlayer';
import type { Song } from '../types/song.types';

interface PlayerCardProps {
  currentSong: Song;
  player: UseMusicPlayerReturn;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ currentSong, player }) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  const {
    isPlaying,
    currentTime,
    duration,
    isLoading,
    togglePlayPause,
    seek,
    next,
    previous,
    containerId,
  } = player;

  // No necesitamos useEffect aquí, el player maneja currentSong automáticamente

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    seek(newTime);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative bg-white/50 dark:bg-black/20 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-lg">
      {/* Iframe de YouTube oculto - debe estar en el DOM para que funcione */}
      <div 
        id={containerId}
        className="fixed pointer-events-none"
        style={{ 
          width: '320px', 
          height: '180px', 
          opacity: 0.01,
          zIndex: -1,
          bottom: '-400px',
          right: '-400px',
          visibility: 'visible', // Debe ser visible para YouTube
        }}
      />
      
      <div className="flex flex-col items-center text-center">
        {isLoading ? (
          <div className="w-48 h-48 rounded-lg bg-gray-300 dark:bg-gray-700 mb-4 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">Cargando...</span>
          </div>
        ) : (
          <img
            alt="Album Art"
            className="w-48 h-48 rounded-lg object-cover mb-4 shadow-xl"
            src={currentSong.image}
          />
        )}
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentSong.title}</p>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{currentSong.artist}</p>
        
        <div className="w-full">
          <div
            ref={progressBarRef}
            className="relative h-2 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div
              className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            ></div>
            <div
              className="absolute top-1/2 -translate-y-1/2 bg-white dark:bg-gray-200 w-4 h-4 rounded-full shadow-md transition-all group-hover:scale-110"
              style={{ left: `calc(${progressPercentage}% - 8px)` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <button 
            onClick={previous}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
            title="Canción anterior"
          >
            <span className="material-symbols-outlined text-4xl">skip_previous</span>
          </button>
          <button
            onClick={() => {
              console.log('[PlayerCard] Botón play/pause clickeado');
              console.log('[PlayerCard] isPlaying antes:', isPlaying);
              togglePlayPause();
            }}
            disabled={isLoading}
            className="p-4 rounded-full text-white bg-primary hover:bg-primary/90 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="material-symbols-outlined text-5xl animate-spin">refresh</span>
            ) : (
              <span className="material-symbols-outlined text-5xl">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            )}
          </button>
          <button 
            onClick={next}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
            title="Siguiente canción"
          >
            <span className="material-symbols-outlined text-4xl">skip_next</span>
          </button>
        </div>
      </div>
    </div>
  );
};

