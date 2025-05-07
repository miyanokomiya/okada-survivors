import { defineConfig } from "vite";

export default defineConfig({
  server: {
    hmr: false,
  },
  base: process.env.BASE_PATH || "/",
  define: {
    "process.env.__APP_VERSION__": JSON.stringify(process.env.TAG_NAME || "development"),
  },
});
