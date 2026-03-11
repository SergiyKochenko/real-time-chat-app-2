import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: [
      "backend/**/*.{test,spec}.js",
      "backend/__tests__/**/*.js",
    ],
    setupFiles: ["./vitest.setup.js"],
  },
});
