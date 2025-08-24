import type { StorageData, PlayerData, GameState, Theme } from './types.js';

/**
 * Gerencia o armazenamento local do jogo
 */
export class StorageManager {
  private static readonly STORAGE_KEY = '2048-game-data';

  /**
   * Salva os dados do jogador no localStorage
   */
  static savePlayerData(playerData: PlayerData): void {
    try {
      const currentData = this.getStorageData();
      const updatedData: StorageData = {
        ...currentData,
        playerData
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.warn('Erro ao salvar dados do jogador:', error);
    }
  }

  /**
   * Recupera os dados do jogador do localStorage
   */
  static getPlayerData(): PlayerData | null {
    try {
      const data = this.getStorageData();
      return data.playerData || null;
    } catch (error) {
      console.warn('Erro ao recuperar dados do jogador:', error);
      return null;
    }
  }

  /**
   * Salva o estado atual do jogo
   */
  static saveGameState(gameState: GameState): void {
    try {
      const currentData = this.getStorageData();
      const updatedData: StorageData = {
        ...currentData,
        lastGameState: gameState
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.warn('Erro ao salvar estado do jogo:', error);
    }
  }

  /**
   * Recupera o último estado do jogo
   */
  static getLastGameState(): GameState | null {
    try {
      const data = this.getStorageData();
      return data.lastGameState || null;
    } catch (error) {
      console.warn('Erro ao recuperar estado do jogo:', error);
      return null;
    }
  }

  /**
   * Atualiza a melhor pontuação do jogador
   */
  static updateBestScore(username: string, newScore: number): void {
    const playerData = this.getPlayerData();
    if (playerData && playerData.username === username) {
      if (newScore > playerData.bestScore) {
        playerData.bestScore = newScore;
        playerData.currentScore = newScore;
        this.savePlayerData(playerData);
      }
    }
  }

  /**
   * Atualiza o tema do jogador
   */
  static updatePlayerTheme(theme: Theme): void {
    const playerData = this.getPlayerData();
    if (playerData) {
      playerData.theme = theme;
      this.savePlayerData(playerData);
    }
  }

  /**
   * Cria dados iniciais para um novo jogador
   */
  static createNewPlayer(username: string): PlayerData {
    const playerData: PlayerData = {
      username,
      bestScore: 0,
      currentScore: 0,
      gamesPlayed: 0,
      theme: 'pastel'
    };
    
    this.savePlayerData(playerData);
    return playerData;
  }

  /**
   * Incrementa o contador de jogos
   */
  static incrementGamesPlayed(): void {
    const playerData = this.getPlayerData();
    if (playerData) {
      playerData.gamesPlayed += 1;
      this.savePlayerData(playerData);
    }
  }

  /**
   * Limpa todos os dados salvos
   */
  static clearAllData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Erro ao limpar dados:', error);
    }
  }

  /**
   * Verifica se há dados salvos
   */
  static hasStoredData(): boolean {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Recupera todos os dados do storage
   */
  private static getStorageData(): StorageData {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data) as StorageData;
      }
    } catch (error) {
      console.warn('Erro ao parsear dados do storage:', error);
    }
    
    return {} as StorageData;
  }

  /**
   * Exporta dados para backup (útil para debug)
   */
  static exportData(): string | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data;
    } catch (error) {
      console.warn('Erro ao exportar dados:', error);
      return null;
    }
  }

  /**
   * Importa dados de backup
   */
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.warn('Erro ao importar dados:', error);
      return false;
    }
  }
}
