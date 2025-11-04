import React, { useState } from 'react';
import { PlaylistItem } from './PlaylistItem';
import type { UseMusicPlayerReturn } from '../hooks/useMusicPlayer';

interface PlaylistQueueProps {
  player: UseMusicPlayerReturn;
}

export const PlaylistQueue: React.FC<PlaylistQueueProps> = ({ player }) => {
  const { queue } = player;
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setDragOverIndex(null);
    
    const data = e.dataTransfer.getData('text/plain');
    if (data) {
      // Si viene de SongItem (agregar a cola)
      try {
        const songData = JSON.parse(data);
        if (songData.id) {
          // Es una canción nueva para agregar
          player.addToQueue(songData);
          return;
        }
      } catch {
        // No es JSON, probablemente es un índice
      }
    }
    
    // Si no es una canción nueva, es un reordenamiento
    const fromIndex = draggedIndex;
    const toIndex = dragOverIndex;
    
    if (fromIndex !== null && toIndex !== null && fromIndex !== toIndex) {
      player.reorderQueue(fromIndex, toIndex);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div
      className={`bg-white/50 dark:bg-black/20 p-6 rounded-xl border border-dashed ${
        isDragOver
          ? 'border-primary drop-zone-active outline-2 outline-dashed outline-primary bg-primary/10'
          : 'border-gray-300 dark:border-gray-700'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Cola de Reproducción
      </h3>
      <div className="space-y-2">
        {queue.length > 0 ? (
          queue.map((item, index) => (
            <React.Fragment key={item.song.id}>
              <PlaylistItem 
                song={item.song}
                index={index}
                isCurrentlyPlaying={index === player.currentIndex && player.isPlaying}
                isPlayed={item.isPlayed}
                isDragging={draggedIndex === index}
                isDragOver={dragOverIndex === index && draggedIndex !== null}
                onPlay={() => {
                  // Si es la canción actual, solo play/pause
                  if (index === player.currentIndex) {
                    player.togglePlayPause();
                  } else {
                    // Cambiar al índice de esta canción (setCurrentIndex ya maneja isPlayed)
                    player.setCurrentIndex(index);
                  }
                }}
                onRemove={() => player.removeFromQueue(item.song.id)}
                onDragStart={(idx) => setDraggedIndex(idx)}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                onDragOver={(e, idx) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragOverIndex(idx);
                }}
                onDrop={(e, idx) => {
                  const fromIndex = draggedIndex;
                  if (fromIndex !== null && fromIndex !== idx) {
                    player.reorderQueue(fromIndex, idx);
                  }
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
              />
              {index < queue.length - 1 && (
                <div className="h-px w-full border-2 border-dashed border-primary/50 my-2 rounded-full"></div>
              )}
            </React.Fragment>
          ))
        ) : (
          <div className="text-center py-6 px-4 border-2 border-dashed border-gray-300 dark:border-gray-700/50 rounded-lg bg-primary/5 dark:bg-primary/10">
            <span className="material-symbols-outlined text-4xl text-primary/70 dark:text-primary/80 mb-2">
              playlist_play
            </span>
            <p className="text-primary/80 dark:text-primary/90 font-medium">
              La cola está vacía
            </p>
          </div>
        )}

        <div className="text-center py-6 px-4 border-2 border-dashed border-gray-300 dark:border-gray-700/50 rounded-lg bg-primary/5 dark:bg-primary/10 mt-2">
          <span className="material-symbols-outlined text-4xl text-primary/70 dark:text-primary/80 mb-2 animate-pulse">
            playlist_add
          </span>
          <p className="text-primary/80 dark:text-primary/90 font-medium">
            Suelta aquí para añadir a la cola.
          </p>
        </div>
      </div>
    </div>
  );
};

