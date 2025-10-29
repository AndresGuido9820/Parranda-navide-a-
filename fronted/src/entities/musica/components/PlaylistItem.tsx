import React from 'react';

interface Song {
  id: number;
  title: string;
  artist: string;
  image: string;
}

interface PlaylistItemProps {
  song: Song;
}

export const PlaylistItem: React.FC<PlaylistItemProps> = ({ song }) => {
  return (
    <div className="song-item flex items-center gap-4 p-2 rounded-lg bg-white dark:bg-background-dark/80 cursor-move shadow-sm">
      <span className="material-symbols-outlined drag-handle text-gray-400 dark:text-gray-500 cursor-grab">
        drag_indicator
      </span>
      <img
        alt="Album Art"
        className="w-12 h-12 rounded-lg object-cover"
        src={song.image}
      />
      <div className="flex-grow">
        <p className="font-semibold text-gray-800 dark:text-white">{song.title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{song.artist}</p>
      </div>
    </div>
  );
};

