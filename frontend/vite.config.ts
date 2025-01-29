import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server:{
    proxy: {
      '/api': { 
        target: 'https://fonta-manager.vercel.app/', // Gunakan target lokal ini saat pengembangan
        changeOrigin: true,
        secure: false
      }
    }
  }
});
