import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { AnoViejoDoll } from '../components/AnoViejoDoll';
import { BurnAnimation } from '../components/BurnAnimation';
import { useAnoViejo } from '../hooks/useAnoViejo';
import type { DressPartType } from '../types/anoViejo.types';

export const AnoViejoPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dressPart, burn, reset, dressOptions } = useAnoViejo();
  const [activePart, setActivePart] = useState<DressPartType>('sombrero');

  const handleBurn = async () => {
    await burn();
  };

  const partLabels: Record<DressPartType, string> = {
    sombrero: 'Sombrero',
    camisa: 'Camisa',
    pantalones: 'Pantalones',
    zapatos: 'Zapatos',
    accesorios: 'Accesorios',
  };

  const isBurning = state.burnStatus === 'quemando';
  const isBurned = state.burnStatus === 'quemado';

  return (
    <MainLayout>
      <div className={`min-h-screen px-2 sm:px-4 py-2 sm:py-4 flex flex-col transition-colors duration-300 ${isBurning ? 'bg-black' : 'bg-[#1a0a0a]'}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
          {/* Botón Regresar */}
          <button
            onClick={() => navigate('/dinamicas')}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-3 w-fit"
          >
            <span className="text-sm font-semibold">Volver a Dinámicas</span>
          </button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl">🔥</span>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Quema del Año Viejo
              </h1>
            </div>
            
            {isBurned && (
              <button 
                onClick={reset}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 text-xs sm:text-sm w-full sm:w-auto justify-center"
              >
                <span className="text-base sm:text-lg">🔄</span>
                Reiniciar
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 flex-1">
            {/* Área del muñeco */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center relative">
              <div className="relative">
                <AnoViejoDoll state={state} />
                
                {isBurning && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20">
                    <BurnAnimation />
                  </div>
                )}
              </div>
            </div>

            {/* Panel de selección */}
            <div className={`bg-[#2a1515] rounded-lg p-4 border border-[#4a2020] flex flex-col ${isBurning || isBurned ? 'opacity-50 pointer-events-none' : ''}`}>
              <h2 className="text-lg font-semibold text-white mb-4">
                Viste tu Año Viejo
              </h2>

              {/* Tabs de partes */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(Object.keys(partLabels) as DressPartType[]).map((part) => (
                  <button
                    key={part}
                    onClick={() => setActivePart(part)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activePart === part
                        ? 'bg-red-700 text-white'
                        : 'bg-[#3a2020] text-white/70 hover:bg-[#4a2020]'
                    }`}
                  >
                    {partLabels[part]}
                  </button>
                ))}
              </div>

              {/* Opciones de la parte activa */}
              <div className="space-y-2 max-h-96 overflow-y-auto mb-4 flex-1">
                {dressOptions[activePart].map((option) => {
                  const isSelected = state.partes[activePart]?.id === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => dressPart(activePart, option)}
                      className={`w-full p-3 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-red-700 text-white'
                          : 'bg-[#3a2020] text-white/90 hover:bg-[#4a2020]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{option.icono}</span>
                          <span className="text-sm font-medium">{option.nombre}</span>
                        </div>
                        {option.id !== 'ninguno' && activePart !== 'accesorios' && activePart !== 'sombrero' && (
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white/30"
                            style={{ backgroundColor: option.color }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Botón de quemar */}
              {!isBurning && !isBurned && (
                <button
                  onClick={handleBurn}
                  className="w-full px-4 py-3 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold text-base transition-colors mt-auto"
                >
                  Quemar el Año Viejo 🔥
                </button>
              )}

              {isBurned && (
                <div className="text-center mt-auto">
                  <p className="text-xl font-bold text-yellow-400 mb-2">
                    ¡Feliz Año Nuevo! 🎊
                  </p>
                  <p className="text-white/70 text-sm">
                    Has dejado atrás lo viejo, es hora de empezar de nuevo
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
