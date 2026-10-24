import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite build config. The React plugin adds JSX support and fast refresh in dev.
export default defineConfig({
  plugins: [react()],
});
