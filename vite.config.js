import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: {
      protocol: 'wss',
      host: process.env.CODESPACE_NAME + '-3000.app.github.dev',
      clientPort: 443
    },
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://licita-facil-platform.vercel.app'
          : 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})