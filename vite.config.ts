import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ghost-tracer/', 
  plugins: [react()],
  define: {
    // This allows the env variables to be replaced during build
    'process.env': {}
  }
})
