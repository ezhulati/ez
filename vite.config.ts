import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Enable minification and tree-shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Improve code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          contentful: ['contentful'],
          lucide: ['lucide-react'],
          utils: ['date-fns', 'framer-motion', 'react-intersection-observer', 'react-markdown']
        }
      }
    },
    // Add source maps only in development
    sourcemap: process.env.NODE_ENV === 'development',
    // Reduce chunk size
    chunkSizeWarningLimit: 1000,
  },
  // Optimize server options
  server: {
    hmr: {
      overlay: true,
    },
    // Preload frequently accessed dependencies
    fs: {
      strict: true,
    },
  },
});
