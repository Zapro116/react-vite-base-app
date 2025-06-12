import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/config': path.resolve(__dirname, './src/config'),
      '@/constants': path.resolve(__dirname, './src/constants'),
      '@/middlewares': path.resolve(__dirname, './src/middlewares'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/layouts': path.resolve(__dirname, './src/layouts'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/images': path.resolve(__dirname, './src/assets/images'),
    },
  },
  // Image and asset handling
  assetsInclude: [
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
    '**/*.svg',
    '**/*.webp',
    '**/*.avif',
  ],
  build: {
    // Build optimizations
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,

    // Asset handling
    assetsDir: 'assets',
    assetsInlineLimit: 4096, // 4kb - inline smaller assets as base64

    rollupOptions: {
      output: {
        // Enhanced code splitting
        manualChunks: {
          // Core libraries
          vendor: ['react', 'react-dom'],

          // UI libraries
          mantine: [
            '@mantine/core',
            '@mantine/hooks',
            '@mantine/notifications',
            '@mantine/modals',
          ],

          // Routing
          router: ['react-router-dom'],

          // Utilities
          utils: ['lodash-es'],
        },

        // Asset naming for better caching
        assetFileNames: assetInfo => {
          const name = assetInfo.name || 'asset';

          // Organize assets by type
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(name)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
            return `fonts/[name]-[hash][extname]`;
          }
          if (/\.css$/i.test(name)) {
            return `css/[name]-[hash][extname]`;
          }

          return `assets/[name]-[hash][extname]`;
        },

        // Chunk naming
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },

      // External dependencies (for library builds)
      external: () => {
        // Don't bundle these in library mode
        return false;
      },
    },

    // Compression and optimization
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
  },

  // Development server configuration
  server: {
    port: 3000,
    open: true,
    cors: true,

    // Proxy configuration for API calls
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Preview server configuration
  preview: {
    port: 4173,
    open: true,
    cors: true,
  },

  // Optimization configuration
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mantine/core',
      '@mantine/hooks',
      '@mantine/notifications',
      '@mantine/modals',
    ],
    exclude: ['@vite/client', '@vite/env'],
  },

  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
