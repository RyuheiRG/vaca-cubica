import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Evitar advertencias menores y dividir dependencias grandes en chunks separados
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("recharts")) return "vendor_recharts";
            if (id.includes("react")) return "vendor_react";
            return "vendor";
          }
        },
      },
    },
  },
});
