import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` makes every built URL relative, so the same build works at
// https://<user>.github.io/<repo>/, at a custom domain root, and locally.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { host: true },
});
