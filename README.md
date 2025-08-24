# 🎮 2048 Game - Versão Fofa e Responsiva

Um jogo 2048 moderno e encantador construído com **Vite + TypeScript**, featuring temas customizáveis, modo escuro, animações suaves e design responsivo mobile-first.

![2048 Game Preview](https://via.placeholder.com/600x400/ff9a9e/ffffff?text=2048+Game+🎮)

## ✨ Características

### 🎯 Funcionalidades Principais
- **Jogo 2048 tradicional** com tabuleiro 4x4
- **Sistema de usuário** com username personalizado
- **Ranking local** salvo no localStorage
- **Animações suaves** com CSS transitions
- **Design responsivo** para desktop e mobile
- **Controles touch** para dispositivos móveis

### 🎨 Temas e Personalização
- **3 temas de cores**: Pastel (padrão), Matrix e Neon
- **Modo escuro/claro** com toggle
- **Fontes fofas** (Poppins do Google Fonts)
- **Cores pastéis** por padrão para visual fofo
- **Efeitos visuais** especiais para temas escuros

### 📱 Experiência Mobile
- **Controles touch** com detecção de swipe
- **Layout adaptativo** mobile-first
- **Interface otimizada** para telas pequenas
- **Botões acessíveis** com tamanho adequado

### 🔧 Tecnologia e Qualidade
- **TypeScript strict** para type safety
- **Arquitetura modular** separando lógica e UI
- **Armazenamento local** para dados persistentes
- **Performance otimizada** com animações eficientes
- **Acessibilidade** com suporte a navegação por teclado

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado (recomendado: usar NVM)
- npm ou yarn

### Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/2048-game.git
cd 2048-game

# Se usar NVM (recomendado)
nvm use  # Usa a versão especificada no .nvmrc

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Acesse http://localhost:5173
```

### Usando NVM (Recomendado)

```bash
# Instalar NVM (Windows)
# Baixe de: https://github.com/coreybutler/nvm-windows/releases

# Instalar Node.js LTS
nvm install --lts
nvm use --lts

# No projeto, usar versão específica
nvm use  # Lê automaticamente o arquivo .nvmrc
```

### Build para Produção

```bash
# Gera build otimizado
npm run build

# Preview do build
npm run preview

# Os arquivos ficam na pasta dist/
```

## 📁 Estrutura do Projeto

```
2048-game/
├── src/
│   ├── styles/
│   │   ├── global.css      # Estilos globais e reset
│   │   ├── themes.css      # Temas de cores
│   │   ├── home.css        # Estilos da página inicial
│   │   └── game.css        # Estilos do jogo
│   ├── types.ts            # Tipos TypeScript
│   ├── storage.ts          # Gerenciamento localStorage
│   ├── game.ts             # Lógica principal do jogo 2048
│   ├── ui.ts               # Manipulação do DOM e UI
│   ├── main.ts             # Página inicial (home)
│   └── game-main.ts        # Controlador do jogo
├── index.html              # Página inicial
├── game.html               # Página do jogo
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎮 Como Jogar

### Controles
- **🖥️ Desktop**: Use as setas do teclado (↑↓←→) ou WASD
- **📱 Mobile**: Deslize o dedo na direção desejada
- **⌨️ Atalhos**:
  - `R` - Reiniciar jogo
  - `Esc` - Voltar à página inicial

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

### 🌸 Pastel (Padrão)
Cores suaves e fofas com gradientes pastéis em rosa e azul.

### 🟢 Matrix
Visual inspirado no filme Matrix com tons de verde e efeitos neon.

### 🌈 Neon
Tema cyberpunk com cores vibrantes em magenta e efeitos luminosos.

### 🌙 Modo Escuro
Disponível para todos os temas com toggle simples.

## 🛠️ Scripts Disponíveis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build
npm run lint       # Verificação ESLint
npm run typecheck  # Verificação TypeScript
```

## 📦 Deploy no GitHub Pages

```bash
# 1. Faça o build
npm run build

# 2. Navegue para a pasta dist
cd dist

# 3. Inicialize git e commit
git init
git add .
git commit -m "Deploy 2048 Game"

# 4. Push para branch gh-pages
git branch -M gh-pages
git remote add origin https://github.com/seu-usuario/2048-game.git
git push -u origin gh-pages

# 5. Configure GitHub Pages nas configurações do repositório
# para usar a branch gh-pages
```

## 🏗️ Arquitetura

### Separação de Responsabilidades
- **`game.ts`**: Lógica pura do jogo 2048 (movimentos, pontuação, validações)
- **`ui.ts`**: Manipulação do DOM e feedback visual
- **`storage.ts`**: Persistência de dados no localStorage
- **`main.ts`**: Controle da página inicial
- **`game-main.ts`**: Orquestração do jogo completo

### Padrões Utilizados
- **Programação Defensiva**: Validações e type guards
- **Separação UI/Lógica**: Game engine independente da apresentação
- **State Management**: Estado centralizado com persistência
- **Event-Driven**: Comunicação via eventos do DOM

## 🎯 Critérios de Aceitação

### ✅ Funcionalidades Core
- [x] Jogo 2048 tradicional funcionando
- [x] Detecção de vitória (tile 2048)
- [x] Detecção de game over
- [x] Sistema de pontuação
- [x] Movimentação via teclado e touch

### ✅ Interface e UX
- [x] Página inicial com input de username
- [x] Transição suave entre páginas
- [x] Animações nos tiles
- [x] Feedback visual para ações
- [x] Design responsivo mobile

### ✅ Persistência e Temas
- [x] Salvamento de dados no localStorage
- [x] Sistema de ranking pessoal
- [x] Múltiplos temas de cores
- [x] Modo escuro/claro
- [x] Preservação de preferências

### ✅ Qualidade de Código
- [x] TypeScript strict sem `any`
- [x] Código modular e organizado
- [x] Comentários e documentação
- [x] Tratamento de erros
- [x] Performance otimizada

## 🐛 Troubleshooting

### Problemas Comuns

**Q: O jogo não carrega**
```bash
# Verifique se as dependências foram instaladas
npm install

# Limpe o cache do navegador
Ctrl + Shift + R (ou Cmd + Shift + R no Mac)
```

**Q: Movimentos não funcionam no mobile**
- Certifique-se de que o JavaScript está habilitado
- Teste em modo privado/incógnito
- Verifique se não há outros scripts interferindo

**Q: Dados não salvam**
- Verifique se localStorage está habilitado
- Teste em modo privado para ver se o problema persiste
- Limpe dados antigos: `localStorage.clear()`

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🎉 Easter Eggs

- Digite "2048" na página inicial para uma surpresa
- Use o código Konami (↑↑↓↓←→←→BA) no jogo para efeito especial

---

**Feito com 💜 e muito ☕ usando Vite + TypeScript**

*Se você chegou até aqui, você é incrível! 🌟*
