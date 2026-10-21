import fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const buildTime = Date.now();

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_BUILD_TIME__: JSON.stringify(buildTime),
  },
  plugins: [
    react(),
    {
      name: 'pwa-versioning',
      generateBundle(_, bundle) {
        this.emitFile({
          type: 'asset',
          fileName: 'version.json',
          source: JSON.stringify({
            version: '2.2.0',
            buildTime: buildTime,
          }),
        });

        try {
          const swContent = fs.readFileSync('public/sw.js', 'utf8');
          // Extract all generated bundle asset paths (.js, .css, etc.)
          const bundleAssets = Object.keys(bundle).map((fileName) => `/${fileName}`);

          let updatedSw = swContent.replace(
            /const SW_VERSION = '.*?';/,
            `const SW_VERSION = '2.2.0-${buildTime}';`
          );

          updatedSw = updatedSw.replace(
            /\/\* BUILD_INJECTED_ASSETS \*\/ \[\]/,
            JSON.stringify(bundleAssets)
          );

          this.emitFile({
            type: 'asset',
            fileName: 'sw.js',
            source: updatedSw,
          });
        } catch (err) {
          console.warn('Could not inject buildTime/assets into sw.js:', err);
        }
      },
    },
  ],
  server: {
    host: true,
    port: 5173,
    open: true,
    strictPort: false,
  },
  preview: {
    host: true,
    port: 5173,
    open: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react/jsx-runtime',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
    ],
  },
  build: {
    cssMinify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('@firebase/firestore') || id.includes('firebase/firestore')) return 'firebase-firestore';
            if (id.includes('@firebase/auth') || id.includes('firebase/auth')) return 'firebase-auth';
            if (id.includes('firebase')) return 'firebase-core';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('lucide-react')) return 'icons';
            return 'vendor';
          }
        },
      },
    },
  },
});
