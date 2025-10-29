import React from 'react';

interface Song {
  id: number;
  title: string;
  artist: string;
  image: string;
}

interface SongItemProps {
  song: Song;
  isDragging?: boolean;
  onDragStart?: () => void;
}

export const SongItem: React.FC<SongItemProps> = ({ song, isDragging, onDragStart }) => {
  return (
    <div
      className={`song-item flex items-center gap-4 p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 cursor-move transition-colors duration-200 ${
        isDragging ? 'dragging opacity-50 outline-2 outline-dashed outline-primary bg-primary/20' : ''
      }`}
      draggable
      onDragStart={onDragStart}
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
      <span className="material-symbols-outlined drag-handle text-gray-400 dark:text-gray-500 opacity-0 transition-opacity">
        drag_indicator
      </span>
    </div>
  );
};

