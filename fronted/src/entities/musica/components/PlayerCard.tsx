import React, { useState } from 'react';

interface Song {
  id: number;
  title: string;
  artist: string;
  image: string;
}

interface PlayerCardProps {
  currentSong: Song;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ currentSong }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(105);
  const [totalTime] = useState(235);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/50 dark:bg-black/20 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-lg">
      <div className="flex flex-col items-center text-center">
        <img
          alt="Album Art"
          className="w-48 h-48 rounded-lg object-cover mb-4 shadow-xl"
          src={currentSong.image}
        />
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentSong.title}</p>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{currentSong.artist}</p>
        
        <div className="w-full">
          <div className="relative h-2 bg-gray-300 dark:bg-gray-700 rounded-full">
            <div
              className="absolute top-0 left-0 h-full bg-primary rounded-full"
              style={{ width: `${(currentTime / totalTime) * 100}%` }}
            ></div>
            <div
              className="absolute top-1/2 -translate-y-1/2 bg-white dark:bg-gray-200 w-4 h-4 rounded-full shadow-md"
              style={{ left: `${(currentTime / totalTime) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalTime)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10">
            <span className="material-symbols-outlined text-3xl">shuffle</span>
          </button>
          <button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10">
            <span className="material-symbols-outlined text-4xl">skip_previous</span>
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-4 rounded-full text-white bg-primary hover:bg-primary/90 shadow-lg"
          >
            <span className="material-symbols-outlined text-5xl">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
          <button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10">
            <span className="material-symbols-outlined text-4xl">skip_next</span>
          </button>
          <button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10">
            <span className="material-symbols-outlined text-3xl">repeat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

