import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/college-mini-projects-and-report/",
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
