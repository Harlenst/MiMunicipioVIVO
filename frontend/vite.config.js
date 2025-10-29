import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite conexiones externas (imprescindible para Live Share)
    port: 5173,      // Asegura que use el puerto 5173 (puedes omitirlo si es el predeterminado)
  },
})