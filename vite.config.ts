import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ghost-tracer/', 
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensures environment variables are handled correctly in production
    minify: 'esbuild'
  }
})
