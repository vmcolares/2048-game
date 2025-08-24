import { StorageManager } from './storage.js';
import type { Theme } from './types.js';

/**
 * Lógica da página inicial (home)
 */

// Elementos do DOM
const usernameInput = document.getElementById('username') as HTMLInputElement;
const startButton = document.getElementById('start-game') as HTMLButtonElement;
const colorThemeSelect = document.getElementById('color-theme') as HTMLSelectElement;

/**
 * Inicializa a página inicial
 */
function initHomePage(): void {
  setupEventListeners();
  loadSavedThemes();
  focusUsernameInput();
}

/**
 * Configura os event listeners
 */
function setupEventListeners(): void {
  // Input do username
  if (usernameInput) {
    usernameInput.addEventListener('input', handleUsernameInput);
    usernameInput.addEventListener('keypress', handleUsernameKeypress);
  }

  // Botão de iniciar
  if (startButton) {
    startButton.addEventListener('click', handleStartGame);
  }

  // Seletor de cores
  if (colorThemeSelect) {
    colorThemeSelect.addEventListener('change', handleColorThemeChange);
  }
}

/**
 * Manipula a entrada do username
 */
function handleUsernameInput(event: Event): void {
  const target = event.target as HTMLInputElement;
  const username = target.value.trim();
  
  // Valida o username
  if (username.length >= 2 && username.length <= 20) {
    startButton.disabled = false;
    target.classList.remove('error');
    target.classList.add('success');
  } else {
    startButton.disabled = true;
    target.classList.remove('success');
    if (username.length > 0) {
      target.classList.add('error');
    } else {
      target.classList.remove('error');
    }
  }
}

/**
 * Manipula o pressionamento de teclas no input
 */
function handleUsernameKeypress(event: KeyboardEvent): void {
  if (event.key === 'Enter' && !startButton.disabled) {
    handleStartGame();
  }
}

/**
 * Inicia o jogo
 */
function handleStartGame(): void {
  const username = usernameInput.value.trim();
  
  if (username.length < 2 || username.length > 20) {
    showError('Nome deve ter entre 2 e 20 caracteres');
    return;
  }

  // Salva ou atualiza os dados do jogador
  let playerData = StorageManager.getPlayerData();
  
  if (!playerData || playerData.username !== username) {
    // Novo jogador
    playerData = StorageManager.createNewPlayer(username);
  }

  // Salva os temas atuais
  const currentTheme = getCurrentTheme();
  
  if (!playerData || playerData.username !== username) {
    // Novo jogador - cria com tema atual
    playerData = StorageManager.createNewPlayer(username);
    StorageManager.updatePlayerTheme(currentTheme);
    
    // Remove tema temporário se existir
    try {
      localStorage.removeItem('2048-temp-theme');
    } catch (error) {
      console.warn('Erro ao remover tema temporário:', error);
    }
  } else {
    // Jogador existente - atualiza tema se mudou
    StorageManager.updatePlayerTheme(currentTheme);
  }

  // Animação de saída e navegação
  showLoading();
  
  setTimeout(() => {
    window.location.href = './game.html';
  }, 500);
}

/**
 * Manipula mudança do tema de cores
 */
function handleColorThemeChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const theme = target.value as Theme;
  setColorTheme(theme);
  
  // Salva o tema automaticamente no localStorage
  saveThemeToStorage(theme);
}

/**
 * Define o tema de cores
 */
function setColorTheme(theme: Theme): void {
  const body = document.body;
  body.setAttribute('data-theme', theme);
}

/**
 * Obtém o tema atual
 */
function getCurrentTheme(): Theme {
  const body = document.body;
  return (body.getAttribute('data-theme') as Theme) || 'pastel';
}

/**
 * Salva o tema atual no localStorage
 */
function saveThemeToStorage(theme: Theme): void {
  const playerData = StorageManager.getPlayerData();
  if (playerData) {
    // Atualiza tema do jogador existente
    StorageManager.updatePlayerTheme(theme);
  } else {
    // Salva tema temporariamente para novo usuário
    try {
      localStorage.setItem('2048-temp-theme', theme);
    } catch (error) {
      console.warn('Erro ao salvar tema temporário:', error);
    }
  }
}

/**
 * Carrega os temas salvos
 */
function loadSavedThemes(): void {
  const playerData = StorageManager.getPlayerData();
  let themeToApply: Theme = 'pastel';
  
  if (playerData) {
    // Jogador existente - usa tema salvo
    themeToApply = playerData.theme;
  } else {
    // Novo usuário - verifica se há tema temporário salvo
    try {
      const tempTheme = localStorage.getItem('2048-temp-theme') as Theme;
      if (tempTheme && ['pastel', 'matrix', 'neon'].includes(tempTheme)) {
        themeToApply = tempTheme;
      }
    } catch (error) {
      console.warn('Erro ao carregar tema temporário:', error);
    }
  }
  
  // Aplica o tema
  setColorTheme(themeToApply);
  
  if (colorThemeSelect) {
    colorThemeSelect.value = themeToApply;
  }
  
  // Pre-preenche o username se já existir
  if (playerData && usernameInput && playerData.username) {
    usernameInput.value = playerData.username;
    const inputEvent = new Event('input', { bubbles: true });
    Object.defineProperty(inputEvent, 'target', { value: usernameInput });
    handleUsernameInput(inputEvent);
  }
}

/**
 * Foca no input do username
 */
function focusUsernameInput(): void {
  if (usernameInput) {
    usernameInput.focus();
  }
}

/**
 * Mostra uma mensagem de erro
 */
function showError(message: string): void {
  // Remove erro anterior se existir
  const existingError = document.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  // Cria nova mensagem de erro
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.style.cssText = `
    background: #ff4444;
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-top: 0.5rem;
    font-size: 0.9rem;
    text-align: center;
    animation: fadeIn 0.3s ease;
  `;
  errorElement.textContent = message;

  // Adiciona após o botão
  if (startButton && startButton.parentNode) {
    startButton.parentNode.insertBefore(errorElement, startButton.nextSibling);
  }

  // Remove após 3 segundos
  setTimeout(() => {
    errorElement.remove();
  }, 3000);
}

/**
 * Mostra estado de loading
 */
function showLoading(): void {
  const loadingElement = document.createElement('div');
  loadingElement.id = 'loading';
  loadingElement.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
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
        border: 2px solid var(--border-color);
      ">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🎮</div>
        <div style="font-size: 1.2rem; font-weight: 600;">Iniciando o jogo...</div>
        <div style="font-size: 0.9rem; margin-top: 0.5rem; color: var(--text-dark);">
          Preparando tudo para você! ✨
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(loadingElement);
}

/**
 * Adiciona animações suaves aos elementos
 */
function addAnimations(): void {
  // Animação de entrada para o card
  const welcomeCard = document.querySelector('.welcome-card');
  if (welcomeCard) {
    welcomeCard.classList.add('fade-in');
  }

  // Animação escalonada para os itens de informação
  const infoItems = document.querySelectorAll('.info-item');
  infoItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('fade-in');
    }, index * 100);
  });
}

/**
 * Easter egg - sequência especial de teclas
 */
function setupEasterEgg(): void {
  let sequence = '';
  const targetSequence = '2048';
  
  document.addEventListener('keydown', (event) => {
    sequence += event.key;
    
    if (sequence.includes(targetSequence)) {
      triggerEasterEgg();
      sequence = '';
    }
    
    // Limita o tamanho da sequência
    if (sequence.length > 10) {
      sequence = sequence.slice(-5);
    }
  });
}

/**
 * Ativa o easter egg
 */
function triggerEasterEgg(): void {
  const title = document.querySelector('.title') as HTMLElement;
  if (title) {
    title.style.animation = 'pulse 0.5s ease-in-out 3';
    
    // Muda temporariamente o texto
    const originalText = title.textContent;
    title.textContent = '🎉 Easter Egg! Você é incrível! 🎉';
    
    setTimeout(() => {
      title.textContent = originalText;
      title.style.animation = '';
    }, 2000);
  }
}

// Inicializa a página quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  initHomePage();
  addAnimations();
  setupEasterEgg();
});
