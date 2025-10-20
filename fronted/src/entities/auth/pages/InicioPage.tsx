import React from "react";
import { Card, CardBody } from "@heroui/react";
import { MainLayout } from "../../../shared/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { useChristmasCountdown } from "../../../shared/hooks/useChristmasCountdown";

export const InicioPage: React.FC = () => {
  const navigate = useNavigate();
  const timeForChristmas = useChristmasCountdown();

  const cardsData = [
    {
      title: "Novenas",
      description:
        "Reza las novenas navideñas y lleva un seguimiento de tu progreso.",
      image: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80",
      link: "/novenas",
    },
    {
      title: "Recetas",
      description: "Descubre recetas tradicionales para la época navideña.",
      image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=80",
      link: "/recetas",
    },
    {
      title: "Música",
      description: "Disfruta de la música navideña tradicional.",
      image: "https://images.unsplash.com/photo-1545608444-f045a6db6133?ixlib=80",
      link: "/musica",
    },
    {
      title: "Dinámicas navideñas",
      description: "Crea dinámicas y sorteos familiares.",
      image: "https://images.unsplash.com/photo-1482003297000-b7663a1673f1?ixlib=80",
      link: "/dinamicas",
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            ¡Feliz Navidad!
          </h1>
          <p className="text-gray-400">
            Disfruta de la magia de la temporada.
          </p>
        </div>

        <Card className="bg-gradient-to-br from-red-900 to-red-950 border-2 border-red-600 rounded-3xl mb-8">
          <CardBody className="py-8">
            <h2 className="text-center text-red-500 text-xl font-semibold mb-4">
              Cuenta Regresiva para Navidad
            </h2>
            <div className="text-center mb-6">
              <h1 className="text-6xl font-bold text-white mb-2">
                {timeForChristmas[0].value}
              </h1>
              <p className="text-gray-300 text-sm">Días restantes</p>
            </div>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              {timeForChristmas.map((time) => (
                <div key={time.name} className="text-center">
                  <h3 className="text-2xl font-bold text-white">
                    {time.value}
                  </h3>
                  <p className="text-gray-400 text-xs">{time.name}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <div className="space-y-4 mb-8">
          {cardsData.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.link)}
              className="overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-gray-700 rounded-3xl h-24 bg-gray-800"
            >
              <div className="relative w-full h-full">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                <div className="absolute inset-0 flex items-center px-6">
                  <h3 className="text-xl font-bold text-white z-10">
                    {card.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-red-900 to-red-950 border-2 border-red-600 rounded-2xl overflow-hidden">
          <div className="flex items-center">
            <div className="w-24 h-24 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80"
                alt="Continua tu Novena"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-4">
              <h3 className="text-white font-bold text-lg mb-1">
                Continua tu Novena
              </h3>
              <p className="text-red-300 text-sm">
                Día 7: La llegada de los Reyes Magos
              </p>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};
