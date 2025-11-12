import React from 'react';
import type { Song } from '../types/song.types';

interface PlaylistItemProps {
  song: Song;
  index: number;
  isCurrentlyPlaying?: boolean;
  isPlayed?: boolean; // Si la canción ya fue reproducida
  isDragging?: boolean;
  isDragOver?: boolean; // Si está siendo arrastrado sobre este elemento
  onPlay?: () => void;
  onRemove?: () => void;
  onDragStart?: (index: number) => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent, index: number) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
}

export const PlaylistItem: React.FC<PlaylistItemProps> = ({ 
  song, 
  index,
  isCurrentlyPlaying,
  isPlayed,
  isDragging,
  isDragOver,
  onPlay,
  onRemove,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    if (onDragStart) {
      onDragStart(index);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (onDragOver) {
      onDragOver(e, index);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (onDrop) {
      onDrop(e, index);
    }
  };

  return (
    <div 
      className={`song-item flex items-center gap-4 p-2 rounded-lg bg-white dark:bg-background-dark/80 cursor-pointer shadow-sm transition-colors ${
        isCurrentlyPlaying 
          ? 'bg-primary/20 dark:bg-primary/30' 
          : isPlayed 
          ? 'bg-gray-100 dark:bg-gray-800 opacity-50' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      } ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'border-2 border-primary border-dashed bg-primary/10' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <span className="material-symbols-outlined drag-handle text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing">
        drag_indicator
      </span>
      <img
        alt="Album Art"
        className="w-12 h-12 rounded-lg object-cover"
        src={song.image}
      />
      <div className="flex-grow" onClick={onPlay}>
        <p className={`font-semibold ${isPlayed ? 'text-gray-500 dark:text-gray-500' : 'text-gray-800 dark:text-white'}`}>{song.title}</p>
        <p className={`text-sm ${isPlayed ? 'text-gray-400 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>{song.artist}</p>
      </div>
      {isCurrentlyPlaying && (
        <span className="material-symbols-outlined text-primary text-xl animate-pulse">
          equalizer
        </span>
      )}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          title="Eliminar de la cola"
        >
          <span className="material-symbols-outlined text-red-500 text-lg">close</span>
        </button>
      )}
    </div>
  );
};

