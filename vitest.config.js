import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

const resolveFromRoot = (pkg) => path.resolve(process.cwd(), "node_modules", pkg);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: resolveFromRoot("react"),
      "react/jsx-runtime": path.resolve(process.cwd(), "node_modules", "react", "jsx-runtime.js"),
      "react-dom": resolveFromRoot("react-dom"),
      "react-dom/client": path.resolve(process.cwd(), "node_modules", "react-dom", "client.js"),
    },
    dedupe: ["react", "react-dom"],
  },
  test: {
    environment: "node",
    environmentMatchGlobs: [
      ["frontend/**", "jsdom"],
    ],
    globals: true,
    include: [
      "backend/**/*.{test,spec}.js",
      "backend/__tests__/**/*.js",
      "frontend/src/**/*.{test,spec}.{js,jsx}",
    ],
    setupFiles: ["./vitest.setup.js", "./frontend/src/setupTests.js"],
    coverage: {
      provider: "v8",
      reportsDirectory: "coverage",
      reporter: ["text", "lcov", "html"],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 80,
      },
    },
  },
});
