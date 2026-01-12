import { defineConfig } from "vitest/config";

/**
 * @description Base Vitest configuration for all monorepo projects.
 * Standardizes common settings like globals and isolated execution.
 */
export const baseConfig = defineConfig({
  test: {
    globals: true,
    /** Standardizing on maxWorkers for Vitest 3+ concurrency management */
    maxWorkers: 1,
    passWithNoTests: true,
  },
});
