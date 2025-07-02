import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src/*" },
      { find: "@pages", replacement: "/src/pages" },
      { find: "@componentes", replacement: "/src/componentes" },
      { find: "@api", replacement: "/src/api" },
      { find: "@types", replacement: "/src/types" },
      { find: "@service", replacement: "/src/service" },
      { find: "@helper", replacement: "/src/helper" },
    ],
  },
});
