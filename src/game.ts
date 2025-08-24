import type { GameBoard, Direction, GameState, GameConfig } from './types.js';

/**
 * Classe principal do jogo 2048
 * Contém toda a lógica do jogo, incluindo movimentação, pontuação e verificações
 */
export class Game2048 {
  private board: GameBoard;
  private score: number;
  private previousBoard: GameBoard | null;
  private previousScore: number;
  private isGameOver: boolean;
  private isWon: boolean;
  private config: GameConfig;

  constructor(config: Partial<GameConfig> = {}) {
    this.config = {
      boardSize: 4,
      winTile: 2048,
      initialTiles: 2,
      ...config
    };
    
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.previousBoard = null;
    this.previousScore = 0;
    this.isGameOver = false;
    this.isWon = false;
    
    this.addRandomTiles(this.config.initialTiles);
  }

  /**
   * Cria um tabuleiro vazio
   */
  private createEmptyBoard(): GameBoard {
    return Array(this.config.boardSize).fill(null).map(() => 
      Array(this.config.boardSize).fill(null)
    );
  }

  /**
   * Cria uma cópia profunda do tabuleiro
   */
  private cloneBoard(board: GameBoard): GameBoard {
    return board.map(row => [...row]);
  }

  /**
   * Adiciona tiles aleatórios ao tabuleiro
   */
  private addRandomTiles(count: number): void {
    const emptyCells = this.getEmptyCells();
    const tilesToAdd = Math.min(count, emptyCells.length);
    
    for (let i = 0; i < tilesToAdd; i++) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells.splice(randomIndex, 1)[0]!;
      
      // 90% chance de ser 2, 10% chance de ser 4
      this.board[row]![col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  /**
   * Retorna todas as células vazias do tabuleiro
   */
  private getEmptyCells(): [number, number][] {
    const emptyCells: [number, number][] = [];
    
    for (let row = 0; row < this.config.boardSize; row++) {
      for (let col = 0; col < this.config.boardSize; col++) {
        if (this.board[row]![col] === null) {
          emptyCells.push([row, col]);
        }
      }
    }
    
    return emptyCells;
  }

  /**
   * Move o tabuleiro na direção especificada
   */
  move(direction: Direction): boolean {
    // Salva o estado anterior para possível undo
    this.previousBoard = this.cloneBoard(this.board);
    this.previousScore = this.score;
    
    let moved = false;
    const rotatedBoard = this.rotateBoard(direction);
    
    for (let row = 0; row < this.config.boardSize; row++) {
      const oldRow = [...rotatedBoard[row]!];
      const newRow = this.moveAndMergeRow(rotatedBoard[row]!);
      rotatedBoard[row] = newRow;
      
      // Verifica se a linha mudou
      if (!this.arraysEqual(oldRow, newRow)) {
        moved = true;
      }
    }
    
    this.board = this.rotateBackBoard(rotatedBoard, direction);
    
    if (moved) {
      this.addRandomTiles(1);
      this.checkGameState();
    }
    
    return moved;
  }

  /**
   * Move e combina uma linha (movendo tudo para a esquerda)
   */
  private moveAndMergeRow(row: (number | null)[]): (number | null)[] {
    // Remove espaços vazios
    const filtered = row.filter(cell => cell !== null) as number[];
    const merged: number[] = [];
    let i = 0;
    
    while (i < filtered.length) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        // Combina dois números iguais
        const mergedValue = filtered[i]! * 2;
        merged.push(mergedValue);
        this.score += mergedValue;
        
        // Verifica se ganhou
        if (mergedValue === this.config.winTile && !this.isWon) {
          this.isWon = true;
        }
        
        i += 2; // Pula o próximo número já combinado
      } else {
        merged.push(filtered[i]!);
        i++;
      }
    }
    
    // Preenche o resto com null
    while (merged.length < this.config.boardSize) {
      merged.push(null as never);
    }
    
    return merged;
  }

  /**
   * Rotaciona o tabuleiro para facilitar o movimento
   */
  private rotateBoard(direction: Direction): GameBoard {
    switch (direction) {
      case 'left':
        return this.board;
      case 'right':
        return this.board.map(row => [...row].reverse());
      case 'up':
        return this.transpose(this.board);
      case 'down':
        return this.transpose(this.board).map(row => [...row].reverse());
      default:
        return this.board;
    }
  }

  /**
   * Rotaciona o tabuleiro de volta à posição original
   */
  private rotateBackBoard(board: GameBoard, direction: Direction): GameBoard {
    switch (direction) {
      case 'left':
        return board;
      case 'right':
        return board.map(row => [...row].reverse());
      case 'up':
        return this.transpose(board);
      case 'down':
        return this.transpose(board.map(row => [...row].reverse()));
      default:
        return board;
    }
  }

  /**
   * Transpõe o tabuleiro (troca linhas por colunas)
   */
  private transpose(board: GameBoard): GameBoard {
    return board[0]!.map((_, colIndex) => 
      board.map(row => row[colIndex]!)
    );
  }

  /**
   * Verifica se dois arrays são iguais
   */
  private arraysEqual(a: (number | null)[], b: (number | null)[]): boolean {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }

  /**
   * Verifica o estado atual do jogo
   */
  private checkGameState(): void {
    // Verifica se ainda há movimentos possíveis
    if (this.getEmptyCells().length === 0 && !this.hasValidMoves()) {
      this.isGameOver = true;
    }
  }

  /**
   * Verifica se ainda há movimentos válidos disponíveis
   */
  private hasValidMoves(): boolean {
    // Verifica movimentos horizontais
    for (let row = 0; row < this.config.boardSize; row++) {
      for (let col = 0; col < this.config.boardSize - 1; col++) {
        if (this.board[row]![col] === this.board[row]![col + 1]) {
          return true;
        }
      }
    }
    
    // Verifica movimentos verticais
    for (let row = 0; row < this.config.boardSize - 1; row++) {
      for (let col = 0; col < this.config.boardSize; col++) {
        if (this.board[row]![col] === this.board[row + 1]![col]) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Reinicia o jogo
   */
  restart(): void {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.previousBoard = null;
    this.previousScore = 0;
    this.isGameOver = false;
    this.isWon = false;
    this.addRandomTiles(this.config.initialTiles);
  }

  /**
   * Desfaz o último movimento
   */
  undo(): boolean {
    if (this.previousBoard) {
      this.board = this.previousBoard;
      this.score = this.previousScore;
      this.previousBoard = null;
      this.isGameOver = false;
      return true;
    }
    return false;
  }

  /**
   * Carrega um estado salvo do jogo
   */
  loadState(state: GameState): void {
    this.board = this.cloneBoard(state.board);
    this.score = state.score;
    this.isGameOver = state.isGameOver;
    this.isWon = state.isWon;
    this.previousBoard = null;
    this.previousScore = 0;
  }

  // Getters
  getBoard(): GameBoard {
    return this.cloneBoard(this.board);
  }

  getScore(): number {
    return this.score;
  }

  getGameOver(): boolean {
    return this.isGameOver;
  }

  getWon(): boolean {
    return this.isWon;
  }

  getCanUndo(): boolean {
    return this.previousBoard !== null;
  }

  getState(): GameState {
    return {
      board: this.getBoard(),
      score: this.score,
      isGameOver: this.isGameOver,
      isWon: this.isWon,
      canUndo: this.getCanUndo()
    };
  }

  /**
   * Retorna estatísticas do jogo atual
   */
  getStats() {
    const emptyCells = this.getEmptyCells().length;
    const highestTile = Math.max(...this.board.flat().filter(Boolean) as number[]);
    const totalTiles = this.config.boardSize * this.config.boardSize - emptyCells;
    
    return {
      emptyCells,
      totalTiles,
      highestTile,
      moves: this.previousBoard ? 1 : 0
    };
  }
}
