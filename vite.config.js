import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'blissful-adventure-production.up.railway.app'
    ]
  },
  preview: {
    allowedHosts: [
      'blissful-adventure-production.up.railway.app'
    ]
  }
})
