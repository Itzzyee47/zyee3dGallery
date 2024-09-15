// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',  // Root directory for Vite
  build: {
    outDir: '../dist', // Output directory for production build
  },
  server: {
    port: 3001, // Port for Vite dev server (should be different from Express)
  },
});
