import { defineConfig } from "vitest/config";

/**
 * @description Global Vitest configuration.
 * Provides the base runner settings for the entire Nx monorepo.
 */
export default defineConfig({
  test: {
    /** Global reporters for all tests */
    reporters: ["default"],
    /** Global coverage configuration */
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
