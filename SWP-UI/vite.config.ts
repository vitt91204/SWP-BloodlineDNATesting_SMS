import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Backend configuration
const API_TARGET = process.env.VITE_API_URL || 'https://possible-macaque-keen.ngrok-free.app';

const isNgrok = API_TARGET.includes('ngrok');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
        ...(isNgrok && {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        })
      },
      '/monthly-revenue': { target: API_TARGET, changeOrigin: true, secure: true },
      '/this-month-payments': { target: API_TARGET, changeOrigin: true, secure: true },
      '/this-month-requests': { target: API_TARGET, changeOrigin: true, secure: true },
      '/monthly-requests': { target: API_TARGET, changeOrigin: true, secure: true },
      '/daily-requests': { target: API_TARGET, changeOrigin: true, secure: true },
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
