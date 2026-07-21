import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/portfoliosite/",
  plugins: [react()],
  resolve: {
    alias: {
      components: fileURLToPath(new URL("./src/components", import.meta.url)),
      data: fileURLToPath(new URL("./src/data", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        url: "http://localhost/portfoliosite/",
      },
    },
    setupFiles: "./src/setupTests.js",
    globals: true,
  },
});
