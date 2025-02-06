import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/kinobox": {
        target: "https://kinobox.tv",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kinobox/, ""),
      },
      
    },
  },
});
