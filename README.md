# 🎮 2048 Game

Um jogo 2048 moderno e responsivo construído com **Vite + TypeScript**. Este projeto foi desenvolvido com o auxílio do **GitHub Copilot** para testar as funcionalidades do agente de IA na criação de aplicações web completas.

## 🌐 Jogar Online

**🎯 [Clique aqui para jogar!](https://vmcolares.github.io/2048-game/)**

## ✨ Características

### 🎯 Funcionalidades Principais
- **Jogo 2048 tradicional** com tabuleiro 4x4
- **Sistema de usuário** com username personalizado
- **Ranking local** salvo no localStorage
- **Animações suaves** com CSS transitions
- **Design responsivo** para desktop e mobile
- **Controles touch** para dispositivos móveis
- **Favicon personalizado** com ícone de controle 🎮

### 🎨 Temas e Personalização
- **3 temas de cores**: Pastel, Matrix e Neon
- **Fontes modernas** (Poppins do Google Fonts)
- **Efeitos visuais** especiais para cada tema
- **Interface otimizada** com header e footer compactos
- **Seletor de tema** integrado na interface

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm

### Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/vmcolares/2048-game.git
cd 2048-game

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Acesse http://localhost:5173
```

## 📁 Estrutura do Projeto

```
2048-game/
├── src/
│   ├── styles/
│   │   ├── global.css      # Estilos globais e reset
│   │   ├── themes.css      # Sistema de temas
│   │   ├── home.css        # Estilos da página inicial
│   │   └── game.css        # Estilos do jogo
│   ├── types.ts            # Tipos TypeScript
│   ├── storage.ts          # Gerenciamento localStorage
│   ├── game.ts             # Lógica principal do jogo 2048
│   ├── ui.ts               # Manipulação do DOM e UI
│   ├── main.ts             # Página inicial (home)
│   └── game-main.ts        # Controlador do jogo
├── .github/
│   └── workflows/
│       └── deploy.yml      # Deploy automático GitHub Pages
├── index.html              # Página inicial
├── game.html               # Página do jogo
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎮 Como Jogar

### Controles
- **🖥️ Desktop**: Use as setas do teclado (↑↓←→)
- **📱 Mobile**: Deslize o dedo na direção desejada
- **🔄 Reiniciar**: Botão "Novo Jogo"
- **🏠 Voltar**: Botão "Voltar" para a página inicial

### Regras
1. **Objetivo**: Combine números iguais para chegar ao tile 2048
2. **Movimento**: Todos os números se movem na direção escolhida
3. **Combinação**: Dois números iguais se juntam formando sua soma
4. **Novo tile**: Aparece um novo número (2 ou 4) após cada movimento
5. **Game Over**: Quando não há mais movimentos possíveis

### Pontuação
- **Pontos**: Ganhe pontos ao combinar números
- **Recorde**: Sua melhor pontuação fica salva
- **Username**: Personalize com seu nome

## 🎨 Temas Disponíveis

### 🌸 Pastel
Cores suaves e modernas com gradientes pastéis em tons de rosa e azul.

### 🟢 Matrix
Visual inspirado no filme Matrix com tons de verde e efeitos neon.

### 🌈 Neon
Tema cyberpunk com cores vibrantes em magenta e efeitos luminosos.

---

**Desenvolvido por Virgínia Colares 💜**

*Projeto criado com o auxílio do GitHub Copilot - Testando as capacidades de IA para desenvolvimento web completo.*
