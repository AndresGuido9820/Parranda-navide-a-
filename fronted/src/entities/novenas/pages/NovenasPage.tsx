import React from 'react';
import { Card, CardBody, CardHeader, Button, Progress } from '@heroui/react';

export const NovenasPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Novenas Navideñas</h1>
          <p className="text-gray-600 text-lg">
            Reza las novenas navideñas y lleva un seguimiento de tu progreso espiritual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }, (_, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-xl font-semibold">Día {i + 1}</h3>
                  <span className="text-sm text-gray-500">Diciembre {16 + i}</span>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Novena del día {i + 1} - Preparación para la Navidad
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso</span>
                      <span>{Math.floor(Math.random() * 100)}%</span>
                    </div>
                    <Progress 
                      value={Math.floor(Math.random() * 100)} 
                      color="primary"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      color="primary" 
                      size="sm" 
                      className="flex-1"
                    >
                      Rezar
                    </Button>
                    <Button 
                      color="secondary" 
                      variant="bordered" 
                      size="sm"
                    >
                      Ver
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
