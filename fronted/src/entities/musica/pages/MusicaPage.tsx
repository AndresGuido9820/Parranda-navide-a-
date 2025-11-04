import React, { useState } from 'react';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { MusicSearchBar, PlayerCard, PlaylistQueue, SongItem } from '../components';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { useYouTubeSearch } from '../hooks/useYouTubeSearch';
import { Spinner } from '@heroui/react';
import type { Song } from '../types/song.types';

export const MusicaPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [draggingSongId, setDraggingSongId] = useState<string | null>(null);

  const player = useMusicPlayer();
  const { addToQueue, queue, currentSong } = player;

  // Búsqueda en YouTube cuando hay query
  const shouldSearchYouTube = searchQuery.trim().length > 0;
  
  const {
    data: youtubeResults = [],
    isLoading: isLoadingYouTube,
    error: youtubeError,
  } = useYouTubeSearch(searchQuery, shouldSearchYouTube);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleDragStart = (songId: string) => {
    setDraggingSongId(songId);
  };

  const handleAddToQueue = (song: Song) => {
    addToQueue(song);
  };

  // Solo mostrar resultados de YouTube cuando hay búsqueda
  // Si no hay búsqueda, no mostrar nada (o mostrar mensaje)
  const displaySongs = shouldSearchYouTube ? youtubeResults : [];

  return (
    <MainLayout>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-white dark:text-white mb-2">
              Música Navideña
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Encuentra y organiza tus villancicos favoritos.
            </p>

            <div className="relative mb-6">
              <MusicSearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Buscar canciones..."
              />
            </div>

            <h3 className="text-xl font-bold text-white dark:text-white mb-4">
              {shouldSearchYouTube ? 'Resultados de YouTube' : 'Busca canciones en YouTube'}
            </h3>

            {!searchQuery && (
              <div className="mb-4 p-4 bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 Escribe en el buscador para encontrar canciones en YouTube y agregarlas a tu cola de reproducción.
                </p>
              </div>
            )}

            {youtubeError && (
              <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  Error al buscar en YouTube: {youtubeError instanceof Error ? youtubeError.message : 'Error desconocido'}
                </p>
              </div>
            )}

            {isLoadingYouTube && (
              <div className="flex justify-center items-center py-8">
                <Spinner size="lg" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">Buscando en YouTube...</span>
              </div>
            )}

            {!isLoadingYouTube && (
              <div className="space-y-2">
                {displaySongs.length === 0 && searchQuery ? (
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    No se encontraron resultados para "{searchQuery}"
                  </div>
                ) : displaySongs.length > 0 ? (
                  displaySongs.map((song) => (
                    <SongItem
                      key={song.id}
                      song={song}
                      isDragging={draggingSongId === song.id}
                      onDragStart={() => handleDragStart(song.id)}
                      onAddToQueue={handleAddToQueue}
                      isInQueue={queue.some((item) => item.song.id === song.id)}
                    />
                  ))
                ) : null}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {currentSong ? (
              <PlayerCard currentSong={currentSong} player={player} />
            ) : (
              <div className="bg-white/50 dark:bg-black/20 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <p className="text-gray-600 dark:text-gray-400">Agrega canciones a la cola para reproducir</p>
                </div>
              </div>
            )}
            <PlaylistQueue player={player} />
          </div>
        </div>
      </main>
    </MainLayout>
  );
};
