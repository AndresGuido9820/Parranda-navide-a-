import React from 'react';
import type { Song } from '../types/song.types';

interface SongItemProps {
  song: Song;
  isDragging?: boolean;
  onDragStart?: () => void;
  onAddToQueue?: (song: Song) => void;
  isInQueue?: boolean;
}

export const SongItem: React.FC<SongItemProps> = ({ 
  song, 
  isDragging, 
  onDragStart,
  onAddToQueue,
  isInQueue
}) => {
  const handleClick = () => {
    if (onAddToQueue) {
      onAddToQueue(song);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'copy';
    // Enviar los datos de la canción como JSON
    e.dataTransfer.setData('text/plain', JSON.stringify(song));
    if (onDragStart) {
      onDragStart();
    }
  };

  return (
    <div
      className={`song-item flex items-center gap-4 p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 cursor-pointer transition-colors duration-200 ${
        isDragging ? 'dragging opacity-50 outline-2 outline-dashed outline-primary bg-primary/20' : ''
      } ${isInQueue ? 'bg-primary/20 dark:bg-primary/30' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      <img
        alt="Album Art"
        className="w-14 h-14 rounded-lg object-cover"
        src={song.image}
      />
      <div className="flex-grow">
        <p className="font-semibold text-gray-800 dark:text-white">{song.title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{song.artist}</p>
      </div>
      <button
        className="p-2 rounded-full hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          if (onAddToQueue) onAddToQueue(song);
        }}
        title={isInQueue ? 'Ya está en la cola' : 'Agregar a la cola'}
      >
        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">
          {isInQueue ? 'check_circle' : 'add'}
        </span>
      </button>
      <span className="material-symbols-outlined drag-handle text-gray-400 dark:text-gray-500 opacity-0 transition-opacity">
        drag_indicator
      </span>
    </div>
  );
};

