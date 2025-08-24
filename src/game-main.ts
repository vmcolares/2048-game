import { Game2048 } from './game.js';
import { UIManager } from './ui.js';
import { StorageManager } from './storage.js';
import type { Direction, PlayerData, GameBoard } from './types.js';

/**
 * Controlador principal do jogo
 */
class GameController {
  private game: Game2048;
  private ui: UIManager;
  private playerData: PlayerData | null = null;
  private isProcessingMove = false;

  constructor() {
    this.game = new Game2048();
    this.ui = new UIManager();
    this.init();
  }

  /**
   * Inicializa o controlador do jogo
   */
  private init(): void {
    this.loadPlayerData();
    this.setupEventListeners();
    this.updateUI();
    this.loadSavedGame();
  }

  /**
   * Carrega os dados do jogador
   */
  private loadPlayerData(): void {
    this.playerData = StorageManager.getPlayerData();
    
    if (!this.playerData) {
      // Se não há dados do jogador, redireciona para home
      window.location.href = './index.html';
      return;
    }

    // Aplica os temas salvos
    this.ui.applyThemes(this.playerData.theme);
    
    // Atualiza nome do jogador na UI
    this.ui.updatePlayerName(this.playerData.username);
  }

  /**
   * Carrega um jogo salvo se existir
   */
  private loadSavedGame(): void {
    const savedState = StorageManager.getLastGameState();
    if (savedState && !savedState.isGameOver) {
      this.game.loadState(savedState);
      this.updateUI();
    }
  }

  /**
   * Configura os event listeners
   */
  private setupEventListeners(): void {
    // Controles do teclado
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Controles touch para mobile
    this.setupTouchControls();
    
    // Botões da interface
    this.setupButtonListeners();
    
    // Prevenção de comportamento padrão das setas
    document.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    });
  }

  /**
   * Configura controles touch para dispositivos móveis
   */
  private setupTouchControls(): void {
    const gameBoard = document.getElementById('game-board');
    if (!gameBoard) return;

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    gameBoard.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        startX = touch.clientX;
        startY = touch.clientY;
      }
    });

    gameBoard.addEventListener('touchend', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      if (touch) {
        endX = touch.clientX;
        endY = touch.clientY;
        this.handleSwipe(startX, startY, endX, endY);
      }
    });
  }

  /**
   * Manipula gestos de swipe
   */
  private handleSwipe(startX: number, startY: number, endX: number, endY: number): void {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const minSwipeDistance = 30;

    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
      return; // Movimento muito pequeno
    }

    let direction: Direction;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Movimento horizontal
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      // Movimento vertical
      direction = deltaY > 0 ? 'down' : 'up';
    }

    this.makeMove(direction);
  }

  /**
   * Configura listeners dos botões
   */
  private setupButtonListeners(): void {
    // Novo jogo
    const newGameBtn = document.getElementById('new-game');
    const restartGameBtn = document.getElementById('restart-game');
    const newGameWinBtn = document.getElementById('new-game-win');
    
    [newGameBtn, restartGameBtn, newGameWinBtn].forEach(btn => {
      btn?.addEventListener('click', () => this.startNewGame());
    });

    // Voltar para home
    const backHomeBtn = document.getElementById('back-home');
    const homeGameBtn = document.getElementById('home-game');
    
    [backHomeBtn, homeGameBtn].forEach(btn => {
      btn?.addEventListener('click', () => this.goHome());
    });

    // Continuar jogando após vitória
    const continueGameBtn = document.getElementById('continue-game');
    continueGameBtn?.addEventListener('click', () => this.continueGame());
  }

  /**
   * Manipula pressionar teclas
   */
  private handleKeydown(event: KeyboardEvent): void {
    if (this.isProcessingMove) return;

    let direction: Direction | null = null;

    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        direction = 'up';
        break;
      case 'ArrowDown':
      case 'KeyS':
        direction = 'down';
        break;
      case 'ArrowLeft':
      case 'KeyA':
        direction = 'left';
        break;
      case 'ArrowRight':
      case 'KeyD':
        direction = 'right';
        break;
      case 'KeyR':
        this.startNewGame();
        break;
      case 'Escape':
        this.goHome();
        break;
    }

    if (direction) {
      this.makeMove(direction);
    }
  }

  /**
   * Executa um movimento
   */
  private makeMove(direction: Direction): void {
    if (this.isProcessingMove || this.game.getGameOver()) return;

    this.isProcessingMove = true;
    
    // Salva o estado anterior para comparação
    const previousBoard = this.game.getBoard().map(row => row.map(cell => cell));

    const moved = this.game.move(direction);
    
    if (moved) {
      // Atualiza UI com animação de movimento
      this.updateUIWithAnimation(previousBoard);
      this.checkGameState();
      this.saveGameState();
    } else {
      this.ui.showInvalidMove();
    }

    // Delay para evitar movimentos muito rápidos e permitir animações
    setTimeout(() => {
      this.isProcessingMove = false;
    }, 250);
  }

  /**
   * Atualiza a UI com animações suaves
   */
  private updateUIWithAnimation(previousBoard: GameBoard): void {
    const board = this.game.getBoard();
    const score = this.game.getScore();
    const bestScore = this.playerData?.bestScore || 0;

    // Atualiza tabuleiro com flag de movimento
    this.ui.updateBoard(board, true);
    
    // Anima tiles combinados após um delay menor para sincronização
    setTimeout(() => {
      this.ui.animateMergedTiles(board, previousBoard);
    }, 50);
    
    // Atualiza pontuação com um pequeno delay para suavizar
    setTimeout(() => {
      this.ui.updateScore(score, bestScore);
    }, 100);
  }

  /**
   * Atualiza toda a interface (sem animações de movimento)
   */
  private updateUI(): void {
    const board = this.game.getBoard();
    const score = this.game.getScore();
    const bestScore = this.playerData?.bestScore || 0;

    this.ui.updateBoard(board, false);
    this.ui.updateScore(score, bestScore);
  }

  /**
   * Verifica o estado do jogo
   */
  private checkGameState(): void {
    const currentScore = this.game.getScore();
    
    // Atualiza melhor pontuação
    if (this.playerData && currentScore > this.playerData.bestScore) {
      this.playerData.bestScore = currentScore;
      StorageManager.updateBestScore(this.playerData.username, currentScore);
      this.ui.animateNewRecord();
    }

    // Verifica vitória
    if (this.game.getWon()) {
      this.ui.showYouWin();
      this.ui.celebrateWin();
    }

    // Verifica game over
    if (this.game.getGameOver()) {
      this.ui.showGameOver(currentScore);
      StorageManager.incrementGamesPlayed();
    }
  }

  /**
   * Salva o estado atual do jogo
   */
  private saveGameState(): void {
    const gameState = this.game.getState();
    StorageManager.saveGameState(gameState);
  }

  /**
   * Inicia um novo jogo
   */
  private startNewGame(): void {
    this.game.restart();
    this.ui.hideGameOver();
    this.ui.hideYouWin();
    this.updateUI();
    this.saveGameState();
    
    if (this.playerData) {
      StorageManager.incrementGamesPlayed();
    }
  }

  /**
   * Continua o jogo após vitória
   */
  private continueGame(): void {
    this.ui.hideYouWin();
  }

  /**
   * Volta para a página inicial
   */
  private goHome(): void {
    // Salva o estado antes de sair
    this.saveGameState();
    
    // Animação de saída
    this.ui.showLoading();
    
    setTimeout(() => {
      window.location.href = './index.html';
    }, 500);
  }

  /**
   * Obtém estatísticas do jogo
   */
  public getGameStats() {
    return {
      ...this.game.getStats(),
      playerData: this.playerData
    };
  }
}

/**
 * Funções utilitárias globais
 */

/**
 * Inicializa o jogo quando a página carrega
 */
function initGame(): void {
  // Verifica se há dados do jogador
  if (!StorageManager.hasStoredData()) {
    window.location.href = './index.html';
    return;
  }

  // Cria o controlador do jogo
  const gameController = new GameController();
  
  // Expõe globalmente para debug (apenas em desenvolvimento)
  if (typeof window !== 'undefined') {
    (window as unknown as { gameController: GameController }).gameController = gameController;
  }

  // Adiciona listeners para visibilidade da página
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // Salva o jogo quando a página fica oculta
      gameController.getGameStats();
    }
  });
}

/**
 * Adiciona suporte a PWA (básico)
 */
function setupPWA(): void {
  // Service Worker será adicionado em versões futuras
  if ('serviceWorker' in navigator) {
    // TODO: Registrar service worker
  }
}

/**
 * Configura análise de performance
 */
function setupPerformanceMonitoring(): void {
  // Monitora Web Vitals básicos
  if ('performance' in window) {
    window.addEventListener('load', () => {
      // TODO: Implementar coleta de métricas
    });
  }
}

// Easter eggs e funcionalidades extras
function setupEasterEggs(): void {
  let konamiCode = '';
  const targetCode = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA';
  
  document.addEventListener('keydown', (e) => {
    konamiCode += e.code;
    
    if (konamiCode.includes(targetCode)) {
      // Ativa easter egg especial
      document.body.style.filter = 'hue-rotate(180deg)';
      setTimeout(() => {
        document.body.style.filter = '';
      }, 3000);
      konamiCode = '';
    }
    
    if (konamiCode.length > targetCode.length) {
      konamiCode = konamiCode.slice(-20);
    }
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  initGame();
  setupPWA();
  setupPerformanceMonitoring();
  setupEasterEggs();
});
