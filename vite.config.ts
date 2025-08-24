import { defineConfig } from 'vite'

export default defineConfig({
  base: '/2048-game/',
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        game: 'game.html'
      }
    }
  }
})
