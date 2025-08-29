import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    hmr: true,
          proxy: {
        '/api': {
          //Use below target when connecting to the production server
          //target: 'https://api.colare.co',

          //Use below target when connecting to the local server
          target: 'http://localhost:5001',
          changeOrigin: true,
          secure: false,
        }
      }
  },
})
