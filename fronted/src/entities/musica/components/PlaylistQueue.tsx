import React, { useState } from 'react';
import { PlaylistItem } from './PlaylistItem';

interface Song {
  id: number;
  title: string;
  artist: string;
  image: string;
}

interface PlaylistQueueProps {
  songs: Song[];
}

export const PlaylistQueue: React.FC<PlaylistQueueProps> = ({ songs }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
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
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Cola de Reproducción
      </h3>
      <div className="space-y-2">
        {songs.map((song, index) => (
          <React.Fragment key={song.id}>
            <PlaylistItem song={song} />
            {index < songs.length - 1 && (
              <div className="h-px w-full border-2 border-dashed border-primary/50 my-2 rounded-full"></div>
            )}
          </React.Fragment>
        ))}

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

