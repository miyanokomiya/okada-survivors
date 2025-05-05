import { defineConfig } from "vite";

export default defineConfig({
  server: {
    hmr: false,
  },
  base: process.env.BASE_PATH || "/",
});
