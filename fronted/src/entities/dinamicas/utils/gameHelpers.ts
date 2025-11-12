import type { Card } from '../types/game.types';

// Íconos navideños para las cartas normales
const CHRISTMAS_ICONS = [
  '❌', '⭐', '🎅', '💔', '🎁', 
  '❄️', '🕯️', '🦌', '⛄', '🎊',
  '🎉', '🚫', '🍪', '✖️', '🎶',
  '🌟', '🎀', '🏠', '🔥'
];

/**
 * Genera 20 cartas con el Niño Dios en una posición aleatoria
 */
export const generateCards = (total: number = 20): Card[] => {
  const cards: Card[] = [];
  
  // Posición aleatoria para el Niño Dios (0-19)
  const ninoDiosPosition = Math.floor(Math.random() * total);
  
  for (let i = 0; i < total; i++) {
    cards.push({
      id: i,
      icon: i === ninoDiosPosition ? '👼' : CHRISTMAS_ICONS[i % CHRISTMAS_ICONS.length],
      isNinoDios: i === ninoDiosPosition,
      isRevealed: false,
    });
  }
  
  return shuffleCards(cards);
};

/**
 * Mezcla el array de cartas usando el algoritmo Fisher-Yates
 */
export const shuffleCards = (cards: Card[]): Card[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
