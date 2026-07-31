import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "static-site",
  publicDir: "../public",
  base: process.env.GITHUB_ACTIONS ? "/interactive-system-diagrams/" : "/",
  plugins: [react()],
  build: {
    outDir: "../pages-dist",
    emptyOutDir: true,
  },
});
