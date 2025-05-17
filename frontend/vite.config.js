import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env,
  },
   server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
         secure: false
      }
    }
  }
});
