/**
 * Tipos TypeScript para o jogo 2048
 */

export type GameBoard = (number | null)[][];
export type Direction = 'up' | 'down' | 'left' | 'right';
export type Theme = 'pastel' | 'matrix' | 'neon';

export interface GameState {
  board: GameBoard;
  score: number;
  isGameOver: boolean;
  isWon: boolean;
  canUndo: boolean;
}

export interface PlayerData {
  username: string;
  bestScore: number;
  currentScore: number;
  gamesPlayed: number;
  theme: Theme;
}

export interface StorageData {
  playerData: PlayerData;
  lastGameState?: GameState;
}

export interface GameConfig {
  boardSize: number;
  winTile: number;
  initialTiles: number;
}
