import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    
    // PWA for offline capabilities and caching
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/i\.postimg\.cc\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
    
    // Support legacy browsers
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    
    // Compress output files
    viteCompression({
      algorithm: 'gzip',
      threshold: 1024,
    }),
    
    // Visualize your bundle
    visualizer({
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
  ],
  
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020',
    
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 800,
    
    // Extreme minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
      },
      format: {
        comments: false,
      }
    },
    
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
    
    // Ensure styles are properly extracted
    cssCodeSplit: true,
    
    // Report compressed size warnings
    reportCompressedSize: true,
  },
  
  // Optimize server options
  server: {
    hmr: {
      overlay: true,
    },
    fs: {
      strict: true,
    },
  },
  
  // Optimized dependency handling
  optimizeDeps: {
    // Force inclusion of important dependencies
    include: [
      'react', 
      'react-dom',
      'react-router-dom',
      'framer-motion',
    ],
    // Exclude problematic dependencies
    exclude: [],
    // Ensure all deps use the same target
    esbuildOptions: {
      target: 'es2020',
    },
  },
});
