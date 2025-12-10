import React, { useState } from 'react';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { MusicSearchBar, PlayerCard, PlaylistQueue, SongItem } from '../components';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { useYouTubeSearch } from '../hooks/useYouTubeSearch';
import { useDefaultSongs } from '../hooks/useDefaultSongs';
import { SongItemSkeleton } from '../../../shared/components/skeletons/Skeleton';
import type { Song } from '../types/song.types';

export const MusicaPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [draggingSongId, setDraggingSongId] = useState<string | null>(null);

  const player = useMusicPlayer();
  const { addToQueue, queue, currentSong } = player;

  // Canciones por defecto desde la API
  const {
    data: defaultSongs = [],
    isLoading: isLoadingDefault,
  } = useDefaultSongs();

  // Búsqueda cuando hay query
  const shouldSearch = searchQuery.trim().length > 0;
  
  const {
    data: searchResults = [],
    isLoading: isLoadingSearch,
    error: searchError,
  } = useYouTubeSearch(searchQuery, shouldSearch);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleDragStart = (songId: string) => {
    setDraggingSongId(songId);
  };

  const handleAddToQueue = (song: Song) => {
    addToQueue(song);
  };

  // Mostrar resultados de búsqueda o canciones por defecto
  const displaySongs = shouldSearch ? searchResults : defaultSongs;
  const isLoading = shouldSearch ? isLoadingSearch : isLoadingDefault;

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
              {shouldSearch ? 'Resultados de búsqueda' : 'Canciones Navideñas'}
            </h3>

            {!searchQuery && (
              <div className="mb-4 p-4 bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 Mostrando las primeras 20 canciones. Escribe en el buscador para buscar más.
                </p>
              </div>
            )}

            {searchError && (
              <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  Error al buscar: {searchError instanceof Error ? searchError.message : 'Error desconocido'}
                </p>
              </div>
            )}

            {isLoading && (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <SongItemSkeleton key={i} />
                ))}
              </div>
            )}

            {!isLoading && (
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
