import React, { useState } from 'react';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { MusicSearchBar, PlayerCard, PlaylistQueue, SongItem } from '../components';

interface Song {
  id: number;
  title: string;
  artist: string;
  image: string;
}

const searchResults: Song[] = [
  {
    id: 1,
    title: 'Campana Sobre Campana',
    artist: 'Villancicos Tradicionales',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7VUg8KHJvGdV0fba7P893U7k8w2fepiOJsAekCIDxN1ZLJrRaiOBcXm_6umKWXxUP64-d731LAl2Ox39KM_2ZbfWVSmHeoDY1KIBTOiVWtUe1umc4OqZRjACAib5on-ts2uMouRO9KQbP4oJF_ELnAZ7hHdAj-i32zwBV_SRiFekohGOeRpMI-ET7O1-H0aSBjIdZ-BhZf0l_IMoyp3QpiZSFiw9a8mpcDLaKI3T5JuUurlfZQX1mawOkyrG0ul_XjOCCdx9sLtEZ',
  },
  {
    id: 2,
    title: 'Los Peces en el Río',
    artist: 'Coro de Niños Cantores',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiFgKh4XkCCme0XLXPGV3kofiRJQdmWQhTRjDQXcXu-d_grUVVJe7GybrYUElG5jdNX-OxuM2M0bpBy952luFC8C1PilbqLzw1lINvpUY7lSIYpVP_HWuT0KZerzsPrsTfavKu6pDTs_Oss-DvvvAScbG1mYXruzGgrFeB4x0P6jJvahm-oKvz5ycZk6ONzm1NUVU1FEr4L_qWkber3soVF-M1Dby3GWleoMCCaUk6IC8_IkXvRjhe8ouTnnuZixpZ20cVvM_Xm6LF',
  },
  {
    id: 3,
    title: 'Mi Burrito Sabanero',
    artist: 'La Rondallita',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQbWwYXrGGUmFx7Q6dbINT-X0K7HW8KOgVjby6tQHoo5sj7-uoo_lRu24AZcMSTKWxaa-4T0m5lRhqGSOoNPIZZBk1I3NDAhPBtLvoWftL6CBU4EjpPnN8GTG_PCTQxnVbgblmxDbK88sAAFXNN6xL6ba5nJOPl48fs_sbdgDK9FQV_drqotcIRCHSmvLcyFZL43Wx8T1rSOHq2h2MGcQwN_YbDZqovv152RzzyeLp8T5C9gCaCfp8t_OEEYQTyXy-Cp_ZcNHl7qvq',
  },
  {
    id: 4,
    title: 'Feliz Navidad',
    artist: 'José Feliciano',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBApGJu1xNVDe52_R8xheXy_PblHfbYevDCPVf66sqBXWN5oHuLISNZ8aRr5AghG1yu1oMdgPrLH0j_GT6YAuhcLfMd-NxIPE3AAr9m1pbllq_MyNlHfjTDQXV_xnOIirsYPSTUl305WHyFKVCu5JGCyoiwYDsQd9HdufNCToFjE8ASfAUnMuI3H8sJoHHNkCL48jfewpvsMDTVsOjqxT2rMVOlY6MvGXWtLCAmEM7c06KRmXddO_LomLU3l-lhrHDefOLQ3XD32KA',
  },
  {
    id: 5,
    title: 'Noche de Paz',
    artist: 'Andrea Bocelli',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMn1k66PqQrgdWtfGPleUmkSlVKjD2iiZaoJ-XmG14WRgCgIZYX7nQtlzPJDJGd6jt2Z-4iq3jm-Y_OuBsZEZYvKg4Hed6HXQJJYbtjXAADrmCxT5rJa8g8Rhk7pkZWnsbgLMKM9jz2rvGcwYUe1sOiva3iAPFk1kEFj5jX9gmfT23V3d98PPK17Ea1b7QaYr5clvwsg_WulbsM6zIird9I6M4nuZ30OxHwOkY5mh7cUW2InXbasiumiHO43lR3i0SVbkUu9C_wvZ6',
  },
];

const playlistSongs: Song[] = [
  {
    id: 6,
    title: 'Last Christmas',
    artist: 'Wham!',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCe7r3BhvGkTmbvtuyKKKCVoB6YedzYLV5rK175mvb4bf1DlGu1-99QGfPxSacmliQJ7kaJzgS2RPVJ9ZtpqgajjRbFIqCz7NLHs4XfZ-9cgIN9JhCmTMK0WWoioLIIOSa0Psr9TEIPNS2VjWcbp5g5h7UsxWBKMW4s9VsZHq36uycMm_z2WO4GKMuagaZBH6yG-7lhsyolkyqecS5FfVKvxXDEilmhL-1dDLLCyKt3b1xrgmpP8vPPGM1YdIeGeKX5zzRH6iaL3Fq_',
  },
  {
    id: 7,
    title: 'Jingle Bell Rock',
    artist: 'Bobby Helms',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD67-DayzAh4SEL7azSj-l2vNX7MuakpnHripHo6Xtn5Gb1mrdG1wsxuBlZO9-4tLDyjGvKL-G6CEGaitJoFpnzr-4vu-yVTyCqLOxW5SlKEP_9AbRNkqzFTal_ohYJERNQ3HK-OCjO9lzyvXT6t6hQGPaCowyTY9Jrn507f3uPMCYxt3NhSTlQ73wDgD9rS0MyjstOn7RSK9wPZLCdlE4lAhkaUsj2jXhXSXGWdIoKIGWSOszwEDAdXRXcuu1jAXm7QBSMnLWkAkdH',
  },
];

const currentSong: Song = {
  id: 8,
  title: 'All I Want for Christmas Is You',
  artist: 'Mariah Carey',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEbr2LSssNEMjSkgSVUrg8VRyw0ZTuulrRGPnBQ3J7F6TwwisGVVb3uoCx7feUnzaVx79jwgAlYsp70pLgSPaqo_SYwtAezPHKl1-T7urU5paDsSYxwu86xjIsI0MX_LP99VVQou6d3NfZqmfjgovxNgnRfCmWh2VR4zSzXjIUVuIHiqkYG7IMvcAcWglXwcZjuKk6Tcr2qnINUnPv21-dccO2XZZeL--xRLv1XRznqSbxdBmV22BOmD21RxwKqECba42o49QsWoxY',
};

export const MusicaPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [draggingSongId, setDraggingSongId] = useState<number | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleDragStart = (songId: number) => {
    setDraggingSongId(songId);
  };

  const filteredSongs = searchQuery
    ? searchResults.filter(
        (song) =>
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchResults;

  return (
    <MainLayout>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
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

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Resultados de Búsqueda
            </h3>

            <div className="space-y-2">
              {filteredSongs.map((song) => (
                <SongItem
                  key={song.id}
                  song={song}
                  isDragging={draggingSongId === song.id}
                  onDragStart={() => handleDragStart(song.id)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <PlayerCard currentSong={currentSong} />
            <PlaylistQueue songs={playlistSongs} />
          </div>
        </div>
      </main>
    </MainLayout>
  );
};
