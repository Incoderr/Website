import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/kinobox': {
        target: 'https://kinobox.tv',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kinobox/, '')
      }
    }
  }
})