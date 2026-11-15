import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxy /api to your Express server so there are no CORS headaches in dev
export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:5000" } },
});
