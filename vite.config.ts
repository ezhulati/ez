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
      brotliSize: true
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Enable minification and tree-shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
    },
    // Improve code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-libs': ['framer-motion', 'lucide-react'],
          'contentful': ['contentful'],
        }
      }
    },
    // Add source maps only in development
    sourcemap: process.env.NODE_ENV === 'development',
    // Improve asset compression
    reportCompressedSize: true,
    // Reduce chunk size
    chunkSizeWarningLimit: 800,
    // Generate modern code for modern browsers
    target: 'es2020',
    // Enable tree-shaking for CSS
    cssCodeSplit: true,
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
    port: 5173
  },
});
