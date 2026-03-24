import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // เพิ่มบรรทัดด้านล่างนี้เพื่อให้แสดงผลบน GitHub Pages ได้ถูกต้อง
  base: '/GO/', 
})
