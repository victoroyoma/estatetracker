import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  envPrefix: 'VITE_',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          utils: ['date-fns', 'clsx', 'class-variance-authority'],
          query: ['@tanstack/react-query'],
          router: ['react-router-dom'],
          icons: ['lucide-react'],
          zustand: ['zustand']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false
  },
  server: {
    port: 5173,
    host: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'recharts',
      '@tanstack/react-query',
      'react-router-dom',
      'lucide-react',
      'zustand',
      'date-fns',
      'clsx'
    ]
  }
})
