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
        //Use below target and secure true when connecting to the production server
        //target: 'https://api.colare.co',
        //secure: true,

        //Use below target and secure false when connecting to the local server
        target: 'http://localhost:3000',
        secure: false,
        
        changeOrigin: true,
      }
    }
  },
})
