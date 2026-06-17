import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@sparrowx': resolve(__dirname, '../SparrowX'),
      '@data':     resolve(__dirname, '../SparrowX/constants'),
      '@assets':   resolve(__dirname, '../SparrowX/public'),
    },
  },
  // Share SparrowX public assets — no duplication
  publicDir: resolve(__dirname, '../SparrowX/public'),
  server: {
    port: 5174,
    open: true,
  },
});
