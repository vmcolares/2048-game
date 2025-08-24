import type { GameBoard, Theme } from './types.js';
import { StorageManager } from './storage.js';

/**
 * Gerencia a interface do usuário e manipulação do DOM
 */
export class UIManager {
  private gameBoard: HTMLElement | null = null;
  private scoreElement: HTMLElement | null = null;
  private bestScoreElement: HTMLElement | null = null;
  private gameOverElement: HTMLElement | null = null;
  private youWinElement: HTMLElement | null = null;
  private playerNameElement: HTMLElement | null = null;

  constructor() {
    this.initializeElements();
    this.setupThemeControls();
  }

  /**
   * Inicializa os elementos do DOM
   */
  private initializeElements(): void {
    this.gameBoard = document.getElementById('game-board');
    this.scoreElement = document.getElementById('current-score');
    this.bestScoreElement = document.getElementById('best-score');
    this.gameOverElement = document.getElementById('game-over');
    this.youWinElement = document.getElementById('you-win');
    this.playerNameElement = document.getElementById('player-name');
  }

  /**
   * Configura os controles de tema
   */
  private setupThemeControls(): void {
    const colorThemeSelect = document.getElementById('color-theme') as HTMLSelectElement;

    if (colorThemeSelect) {
      colorThemeSelect.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        const theme = target.value as Theme;
        this.setColorTheme(theme);
        
        // Salva automaticamente no localStorage
        this.saveThemeToStorage(theme);
      });
    }
  }

  /**
   * Atualiza o tabuleiro do jogo com animações suaves
   */
  updateBoard(board: GameBoard, isMove: boolean = false): void {
    if (!this.gameBoard) return;

    if (isMove) {
      this.updateBoardWithMovement(board);
    } else {
      this.renderBoard(board);
    }
  }

  /**
   * Atualiza o tabuleiro preservando elementos existentes para animação suave
   */
  private updateBoardWithMovement(board: GameBoard): void {
    if (!this.gameBoard) return;

    const existingCells = Array.from(this.gameBoard.querySelectorAll('.game-cell'));
    
    // Anima movimento das células existentes
    existingCells.forEach(cell => {
      if (cell.textContent && cell.textContent !== '') {
        cell.classList.add('moving-tile');
      }
    });

    // Aguarda um frame antes de atualizar o conteúdo
    requestAnimationFrame(() => {
      this.renderBoardSmooth(board);
    });
  }

  /**
   * Renderiza o tabuleiro de forma suave, reutilizando elementos
   */
  private renderBoardSmooth(board: GameBoard): void {
    if (!this.gameBoard) return;

    const cells = this.gameBoard.querySelectorAll('.game-cell');
    
    // Atualiza cada célula existente
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row]!.length; col++) {
        const index = row * board.length + col;
        const cell = cells[index] as HTMLElement;
        const value = board[row]![col];
        
        if (cell) {
          // Remove classes antigas
          cell.className = 'game-cell';
          
          if (value) {
            cell.textContent = value.toString();
            cell.classList.add(`tile-${value}`);
          } else {
            cell.textContent = '';
          }
        }
      }
    }

    // Remove animação de movimento após um tempo
    setTimeout(() => {
      const movingCells = this.gameBoard?.querySelectorAll('.moving-tile');
      movingCells?.forEach(cell => {
        cell.classList.remove('moving-tile');
      });
    }, 100);
  }

  /**
   * Renderiza o tabuleiro do zero
   */
  private renderBoard(board: GameBoard): void {
    if (!this.gameBoard) return;

    // Limpa o tabuleiro atual
    this.gameBoard.innerHTML = '';

    // Cria as células do tabuleiro
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row]!.length; col++) {
        const cell = document.createElement('div');
        cell.className = 'game-cell';
        
        const value = board[row]![col];
        if (value) {
          cell.textContent = value.toString();
          cell.classList.add(`tile-${value}`);
          
          // Adiciona animação para novos tiles com delay
          requestAnimationFrame(() => {
            cell.classList.add('new-tile');
            setTimeout(() => {
              cell.classList.remove('new-tile');
            }, 200);
          });
        }

        this.gameBoard.appendChild(cell);
      }
    }
  }

  /**
   * Atualiza a animação de tiles combinados com efeito suave
   */
  animateMergedTiles(board: GameBoard, previousBoard: GameBoard): void {
    if (!this.gameBoard) return;

    const cells = this.gameBoard.querySelectorAll('.game-cell');
    
    // Primeiro, identifica quais tiles vão ser mesclados
    const mergedPositions: {row: number, col: number}[] = [];
    
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row]!.length; col++) {
        const currentValue = board[row]![col];
        const previousValue = previousBoard[row]![col];
        
        // Se o valor dobrou, é uma mesclagem
        if (currentValue && previousValue && currentValue > previousValue) {
          mergedPositions.push({row, col});
        }
      }
    }

    // Anima pré-mesclagem para suavizar a transição
    mergedPositions.forEach(({row, col}) => {
      const index = row * board.length + col;
      const cell = cells[index] as HTMLElement;
      
      if (cell) {
        // Remove todas as animações anteriores
        cell.classList.remove('merged-tile', 'new-tile', 'moving-tile', 'pre-merge');
        
        // Força reflow
        cell.offsetHeight;
        
        // Adiciona pré-mesclagem
        cell.classList.add('pre-merge');
        
        // Após pré-mesclagem, faz a mesclagem real
        setTimeout(() => {
          cell.classList.remove('pre-merge');
          cell.classList.add('merged-tile');
          
          // Remove animação de mesclagem
          setTimeout(() => {
            cell.classList.remove('merged-tile');
          }, 250);
        }, 100);
      }
    });
  }

  /**
   * Atualiza a pontuação
   */
  updateScore(currentScore: number, bestScore: number): void {
    if (this.scoreElement) {
      this.scoreElement.textContent = currentScore.toString();
      
      // Animação de pontuação
      this.scoreElement.classList.add('scale-in');
      setTimeout(() => {
        this.scoreElement?.classList.remove('scale-in');
      }, 300);
    }

    if (this.bestScoreElement) {
      this.bestScoreElement.textContent = bestScore.toString();
    }
  }

  /**
   * Mostra a tela de game over
   */
  showGameOver(finalScore: number): void {
    if (this.gameOverElement) {
      const finalScoreElement = document.getElementById('final-score');
      if (finalScoreElement) {
        finalScoreElement.textContent = finalScore.toString();
      }
      
      this.gameOverElement.classList.remove('hidden');
      this.gameOverElement.classList.add('fade-in');
    }
  }

  /**
   * Esconde a tela de game over
   */
  hideGameOver(): void {
    if (this.gameOverElement) {
      this.gameOverElement.classList.add('hidden');
      this.gameOverElement.classList.remove('fade-in');
    }
  }

  /**
   * Mostra a tela de vitória
   */
  showYouWin(): void {
    if (this.youWinElement) {
      this.youWinElement.classList.remove('hidden');
      this.youWinElement.classList.add('fade-in');
    }
  }

  /**
   * Esconde a tela de vitória
   */
  hideYouWin(): void {
    if (this.youWinElement) {
      this.youWinElement.classList.add('hidden');
      this.youWinElement.classList.remove('fade-in');
    }
  }

  /**
   * Atualiza o nome do jogador
   */
  updatePlayerName(username: string): void {
    if (this.playerNameElement) {
      this.playerNameElement.textContent = `Olá, ${username}! 👋`;
    }
  }

  /**
   * Define o tema de cores
   */
  setColorTheme(theme: Theme): void {
    const body = document.body;
    body.setAttribute('data-theme', theme);
    
    // Atualiza o select
    const colorThemeSelect = document.getElementById('color-theme') as HTMLSelectElement;
    if (colorThemeSelect) {
      colorThemeSelect.value = theme;
    }
  }

  /**
   * Aplicar tema salvo
   */
  applyThemes(theme: Theme): void {
    this.setColorTheme(theme);
  }

  /**
   * Salva o tema no localStorage
   */
  private saveThemeToStorage(theme: Theme): void {
    // Atualiza o tema do jogador no storage
    StorageManager.updatePlayerTheme(theme);
  }

  /**
   * Mostra feedback visual para movimento inválido
   */
  showInvalidMove(): void {
    if (this.gameBoard) {
      this.gameBoard.classList.add('shake');
      setTimeout(() => {
        if (this.gameBoard) {
          this.gameBoard.classList.remove('shake');
        }
      }, 300);
    }
  }

  /**
   * Adiciona animação de sucesso para novo recorde
   */
  animateNewRecord(): void {
    if (this.bestScoreElement) {
      this.bestScoreElement.classList.add('pulse');
      setTimeout(() => {
        if (this.bestScoreElement) {
          this.bestScoreElement.classList.remove('pulse');
        }
      }, 600);
    }
  }

  /**
   * Mostra loading state
   */
  showLoading(): void {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading';
    loadingElement.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      ">
        <div style="
          background: var(--bg-card);
          padding: 2rem;
          border-radius: 16px;
          text-align: center;
          color: var(--text-primary);
        ">
          <div style="font-size: 2rem; margin-bottom: 1rem;">🎮</div>
          <div>Carregando...</div>
        </div>
      </div>
    `;
    document.body.appendChild(loadingElement);
  }

  /**
   * Esconde loading state
   */
  hideLoading(): void {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.remove();
    }
  }

  /**
   * Adiciona efeito de celebração para vitória
   */
  celebrateWin(): void {
    // Cria confetti simples com CSS
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        this.createConfetti();
      }, i * 50);
    }
  }

  /**
   * Cria um elemento de confetti
   */
  private createConfetti(): void {
    const confetti = document.createElement('div');
    const colors = ['#ff9a9e', '#fecfef', '#00ff00', '#ff00ff', '#00ffff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${randomColor};
      left: ${Math.random() * 100}vw;
      top: -10px;
      z-index: 1000;
      border-radius: 50%;
      pointer-events: none;
      animation: fall 3s linear forwards;
    `;
    
    // Adiciona animação CSS se não existir
    if (!document.querySelector('#confetti-style')) {
      const style = document.createElement('style');
      style.id = 'confetti-style';
      style.textContent = `
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(confetti);
    
    // Remove o confetti após a animação
    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
}
