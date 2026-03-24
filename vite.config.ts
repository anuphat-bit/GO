import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/GO/',
  build: {
    rollupOptions: {
      input: 'index.html' // ย้ำให้ Vite รู้ว่าเริ่มที่นี่
    }
  }
})
