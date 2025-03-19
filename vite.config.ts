import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react', 'react-transition-group'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        // Don't remove console.error for debugging purposes
        drop_console: false,
        drop_debugger: true,
      },
    },
    // Reasonable chunk size warning limit
    chunkSizeWarningLimit: 800,
    // Generate source maps for debugging
    sourcemap: true,
  },
  
  // Optimize server options
  server: {
    hmr: {
      overlay: true,
    },
  },

  // Enable CSS source maps in development
  css: {
    devSourcemap: true,
  },

  // Optimize load times with faster browser targets
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
});
