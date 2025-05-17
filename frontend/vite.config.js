import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env,
  },
   server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // Updated port
        changeOrigin: true,
        secure: false
      }
    }
  }
});
