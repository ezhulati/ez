import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
  ],
  
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020',
    
    // Enable minification with terser
    minify: 'terser',
    
    // Break up chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-libs': ['framer-motion', 'lucide-react'],
          'contentful': ['contentful'],
        }
      }
    },
  },
  
  // Optimize server options
  server: {
    hmr: {
      overlay: true,
    },
  },
});
