import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7001',
        changeOrigin: true,
        secure: false,
      },
      '/Events': {
        target: 'https://localhost:7001',
        changeOrigin: true,
        secure: false,
      },
      '/Organizer': {
        target: 'https://localhost:7001',
        changeOrigin: true,
        secure: false,
      },
      '/Account': {
        target: 'https://localhost:7001',
        changeOrigin: true,
        secure: false,
      },
      '/Admin': {
        target: 'https://localhost:7001',
        changeOrigin: true,
        secure: false,
      },
      '/Inquiry': {
        target: 'https://localhost:7001',
        changeOrigin: true,
        secure: false,
      },
      '/Dashboard': {
        target: 'https://localhost:7001',
        changeOrigin: true,
        secure: false,
      },
      '/Booking': {
        target: 'https://localhost:7001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: '../EventBooking.Web/wwwroot',
    emptyOutDir: true,
  }
})
