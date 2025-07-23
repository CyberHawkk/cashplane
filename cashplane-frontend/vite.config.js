import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // optional alias
    },
  },
  server: {
    port: 5173, // or any preferred port
    open: true,
    // 🔥 This is the key fix:
    historyApiFallback: true,
  },
});
