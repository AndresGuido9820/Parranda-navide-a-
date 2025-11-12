export interface Card {
  id: number;
  icon: string;
  isNinoDios: boolean;
  isRevealed: boolean;
}

export type GameStatus = 'sin-iniciar' | 'jugando' | 'ganado' | 'perdido';

export interface GameState {
  cards: Card[];
  attemptsRemaining: number;
  status: GameStatus;
  roundsWon: number;
  cardsRevealed: number;
}
