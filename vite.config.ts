import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative asset URLs keep the app working on GitHub Pages project paths
  // as well as custom domains and preview paths.
  base: './',
  plugins: [react()],
})
