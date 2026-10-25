import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite build config. The React plugin adds JSX support and fast refresh in dev.
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // The quest bank lives in data/ at the repo root, outside frontend/,
      // so the dev server must be allowed to read the parent folder.
      allow: ['..'],
    },
  },
});
