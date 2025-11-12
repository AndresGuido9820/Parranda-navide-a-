import { useState, useCallback } from 'react';
import type { GameState, GameStatus } from '../types/game.types';
import { generateCards } from '../utils/gameHelpers';

const TOTAL_CARDS = 20;
const MAX_ATTEMPTS = 4;

export const useNinoDiosGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    attemptsRemaining: MAX_ATTEMPTS,
    status: 'sin-iniciar',
    roundsWon: 0,
    cardsRevealed: 0,
  });

  // Inicializar juego con cartas aleatorias
  const initializeGame = useCallback(() => {
    const newCards = generateCards(TOTAL_CARDS);
    
    setGameState((prev) => ({
      cards: newCards,
      attemptsRemaining: MAX_ATTEMPTS,
      status: 'jugando' as GameStatus,
      roundsWon: prev.roundsWon, // Mantener rondas ganadas
      cardsRevealed: 0,
    }));
  }, []);

  // Manejar click en una carta
  const revealCard = useCallback((cardId: number) => {
    setGameState((prev) => {
      // No hacer nada si el juego no está en estado "jugando"
      if (prev.status !== 'jugando') return prev;

      const cardIndex = prev.cards.findIndex((c) => c.id === cardId);
      const card = prev.cards[cardIndex];

      // No hacer nada si la carta ya está revelada
      if (card.isRevealed) return prev;

      const newCards = [...prev.cards];
      newCards[cardIndex] = { ...card, isRevealed: true };

      const newAttemptsRemaining = prev.attemptsRemaining - 1;
      const newCardsRevealed = prev.cardsRevealed + 1;

      // Verificar si encontró al Niño Dios
      if (card.isNinoDios) {
        return {
          ...prev,
          cards: newCards,
          status: 'ganado' as GameStatus,
          cardsRevealed: newCardsRevealed,
          roundsWon: prev.roundsWon + 1,
        };
      }

      // Verificar si perdió (sin intentos)
      if (newAttemptsRemaining === 0) {
        // Revelar todas las cartas al perder
        const allRevealed = newCards.map((c) => ({ ...c, isRevealed: true }));
        return {
          ...prev,
          cards: allRevealed,
          attemptsRemaining: 0,
          status: 'perdido' as GameStatus,
          cardsRevealed: newCardsRevealed,
        };
      }

      // Continuar jugando
      return {
        ...prev,
        cards: newCards,
        attemptsRemaining: newAttemptsRemaining,
        cardsRevealed: newCardsRevealed,
      };
    });
  }, []);

  // Reiniciar juego (nueva ronda)
  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  return {
    gameState,
    initializeGame,
    revealCard,
    resetGame,
  };
};
