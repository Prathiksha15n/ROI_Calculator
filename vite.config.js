import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'roi-calculator.up.railway.app'
    ]
  },
  preview: {
    allowedHosts: [
      'roi-calculator.up.railway.app'
    ]
  }
})
