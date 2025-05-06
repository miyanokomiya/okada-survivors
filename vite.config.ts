import { defineConfig } from "vite";

export default defineConfig({
  server: {
    hmr: false,
  },
  base: process.env.BASE_PATH || "/",
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
