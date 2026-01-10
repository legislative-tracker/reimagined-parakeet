import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",

    setupFiles: ["./test/setup.ts"],
    include: ["src/**/*.{test,spec}.ts"],
    alias: {
      "firebase-admin": path.resolve(__dirname, "node_modules/firebase-admin"),
    },
  },
});
