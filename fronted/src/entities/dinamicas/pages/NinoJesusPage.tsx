import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { useNinoDiosGame } from '../hooks/useNinoDiosGame';

export const NinoJesusPage: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, initializeGame, revealCard, resetGame } = useNinoDiosGame();

  // Inicializar juego al cargar la página
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Mapear status a texto en español
  const getStatusText = () => {
    switch (gameState.status) {
      case 'sin-iniciar':
        return 'Sin iniciar';
      case 'jugando':
        return 'Jugando...';
      case 'ganado':
        return '¡Ganaste! 🎉';
      case 'perdido':
        return 'Perdiste 😢';
      default:
        return 'Sin iniciar';
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#1a0a0a] px-2 sm:px-4 py-2 sm:py-4 flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
          {/* Botón Regresar */}
          <button
            onClick={() => navigate('/dinamicas')}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-3 w-fit"
          >
            <span className="text-xl">←</span>
            <span className="text-sm font-semibold">Volver a Dinámicas</span>
          </button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl">🎄</span>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Encuentra al Niño Dios
              </h1>
            </div>
            
            <button 
              onClick={resetGame}
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 text-xs sm:text-sm w-full sm:w-auto justify-center"
            >
              <span className="text-base sm:text-lg">🔄</span>
              Nueva ronda
            </button>
          </div>

          {/* Subtítulo */}
          <p className="text-white/90 text-center mb-2 sm:mb-3 text-xs sm:text-sm">
            Tienes 4 intentos para revelar la carta del Niño Dios.
          </p>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 mb-3 sm:mb-4 text-white text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-lg sm:text-xl">❤️</span>
              <span className="font-semibold">Intentos restantes:</span>
              <span className="text-lg sm:text-xl font-bold">{gameState.attemptsRemaining}</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-lg sm:text-xl">🏆</span>
              <span className="font-semibold">Rondas ganadas:</span>
              <span className="text-lg sm:text-xl font-bold">{gameState.roundsWon}</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-lg sm:text-xl">⏰</span>
              <span className="font-semibold">Estado:</span>
              <span className="font-bold">{getStatusText()}</span>
            </div>
          </div>

          {/* Grid de Cartas - Responsive: 4 columnas en móvil, 5 en desktop */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3 max-w-6xl mx-auto flex-1 w-full">
            {gameState.cards.map((card) => (
              <div
                key={card.id}
                onClick={() => revealCard(card.id)}
                className={`aspect-square rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center ${
                  card.isRevealed
                    ? card.isNinoDios
                      ? 'bg-yellow-600 border-yellow-400 shadow-lg shadow-yellow-500/50'
                      : 'bg-[#3a2020] border-[#5a3030]'
                    : 'bg-[#2a1515] border-[#4a2020] hover:border-red-700 hover:scale-105'
                }`}
              >
                <span className="text-3xl sm:text-5xl">
                  {card.isRevealed ? card.icon : '?'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};