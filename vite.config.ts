/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/kid-games/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
