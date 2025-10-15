import React from 'react';
import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react';

const canciones = [
  {
    id: 1,
    titulo: 'Noche de Paz',
    artista: 'Villancicos Tradicionales',
    duracion: '3:45',
    categoria: 'Villancicos'
  },
  {
    id: 2,
    titulo: 'Blanca Navidad',
    artista: 'Bing Crosby',
    duracion: '2:40',
    categoria: 'Clásicos'
  },
  {
    id: 3,
    titulo: 'Jingle Bells',
    artista: 'Tradicional',
    duracion: '2:15',
    categoria: 'Villancicos'
  },
  {
    id: 4,
    titulo: 'Feliz Navidad',
    artista: 'José Feliciano',
    duracion: '3:20',
    categoria: 'Latina'
  },
  {
    id: 5,
    titulo: 'El Niño del Tambor',
    artista: 'Villancicos Tradicionales',
    duracion: '3:10',
    categoria: 'Villancicos'
  },
  {
    id: 6,
    titulo: 'All I Want for Christmas',
    artista: 'Mariah Carey',
    duracion: '4:01',
    categoria: 'Pop'
  }
];

export const MusicaPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Música Navideña</h1>
          <p className="text-gray-600 text-lg">
            Disfruta de la mejor música navideña tradicional y moderna.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {canciones.map((cancion) => (
            <Card key={cancion.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start w-full">
                  <h3 className="text-xl font-semibold">{cancion.titulo}</h3>
                  <Chip 
                    color="primary"
                    size="sm"
                  >
                    {cancion.categoria}
                  </Chip>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <p className="text-gray-600 font-medium">{cancion.artista}</p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>🎵 {cancion.duracion}</span>
                    <span>📁 {cancion.categoria}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      color="primary" 
                      className="flex-1"
                    >
                      ▶️ Reproducir
                    </Button>
                    <Button 
                      color="secondary" 
                      variant="bordered"
                    >
                      ❤️
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
