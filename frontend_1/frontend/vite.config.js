import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@react-pdf/renderer', '@react-pdf/stylesheet']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 3000,
    target: 'esnext',
    rollupOptions: {
      external: ['@react-pdf/stylesheet'],
      output: {
        manualChunks(id) {
          // React core
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          // Router
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router/')) {
            return 'router';
          }
          // MUI
          if (id.includes('node_modules/@mui/') || id.includes('node_modules/@emotion/')) {
            return 'mui';
          }
          // Three.js / 3D
          if (id.includes('node_modules/three/') || id.includes('node_modules/@react-three/')) {
            return 'three-3d';
          }
          // Charts
          if (id.includes('node_modules/chart.js/') || id.includes('node_modules/react-chartjs-2/') || id.includes('node_modules/recharts/')) {
            return 'charts';
          }
          // Animations
          if (id.includes('node_modules/framer-motion/')) {
            return 'animations';
          }
          // PDF
          if (id.includes('node_modules/@react-pdf/')) {
            return 'pdf';
          }
          // Groq / AI
          if (id.includes('node_modules/groq-sdk/')) {
            return 'groq';
          }
          // Other node_modules
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        }
      }
    }
  }
})