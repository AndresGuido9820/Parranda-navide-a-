import React from 'react';

interface MusicSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MusicSearchBar: React.FC<MusicSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar canciones...',
}) => {
  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
      />
    </div>
  );
};

