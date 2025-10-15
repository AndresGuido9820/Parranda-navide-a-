import React from 'react';
import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react';

const recetas = [
  {
    id: 1,
    nombre: 'Buñuelos',
    descripcion: 'Deliciosos buñuelos tradicionales navideños',
    dificultad: 'Fácil',
    tiempo: '30 min',
    categoria: 'Postres'
  },
  {
    id: 2,
    nombre: 'Natilla',
    descripcion: 'Cremosa natilla casera para la cena de Navidad',
    dificultad: 'Medio',
    tiempo: '45 min',
    categoria: 'Postres'
  },
  {
    id: 3,
    nombre: 'Lechona',
    descripcion: 'Tradicional lechona navideña colombiana',
    dificultad: 'Difícil',
    tiempo: '4 horas',
    categoria: 'Platos principales'
  },
  {
    id: 4,
    nombre: 'Tamales',
    descripcion: 'Tamales navideños con pollo y cerdo',
    dificultad: 'Medio',
    tiempo: '2 horas',
    categoria: 'Platos principales'
  },
  {
    id: 5,
    nombre: 'Ponche de frutas',
    descripcion: 'Bebida caliente tradicional navideña',
    dificultad: 'Fácil',
    tiempo: '20 min',
    categoria: 'Bebidas'
  },
  {
    id: 6,
    nombre: 'Empanadas',
    descripcion: 'Empanadas de carne para la cena de Navidad',
    dificultad: 'Medio',
    tiempo: '1 hora',
    categoria: 'Aperitivos'
  }
];

export const RecetasPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Recetas Navideñas</h1>
          <p className="text-gray-600 text-lg">
            Descubre las mejores recetas tradicionales para celebrar la Navidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recetas.map((receta) => (
            <Card key={receta.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start w-full">
                  <h3 className="text-xl font-semibold">{receta.nombre}</h3>
                  <Chip 
                    color={receta.dificultad === 'Fácil' ? 'success' : 
                           receta.dificultad === 'Medio' ? 'warning' : 'danger'}
                    size="sm"
                  >
                    {receta.dificultad}
                  </Chip>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <p className="text-gray-600">{receta.descripcion}</p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>⏱️ {receta.tiempo}</span>
                    <span>📁 {receta.categoria}</span>
                  </div>
                  
                  <Button 
                    color="primary" 
                    className="w-full"
                  >
                    Ver Receta
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
