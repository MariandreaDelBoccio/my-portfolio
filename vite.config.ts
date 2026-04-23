import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

function ghPagesBase(): string {
  const p = process.env.GH_PAGES_BASE;
  if (p == null || p === "") return "/";
  if (p === "/") return "/";
  return p.endsWith("/") ? p : `${p}/`;
}

export default defineConfig(({ mode }) => ({
  base: ghPagesBase(),
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
