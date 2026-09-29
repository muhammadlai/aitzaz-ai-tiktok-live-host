import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/aitzaz-ai-tiktok-live-host/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app-[hash].js',
        chunkFileNames: 'assets/chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
