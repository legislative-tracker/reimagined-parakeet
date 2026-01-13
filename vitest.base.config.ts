import { defineConfig } from "vitest/config";

/**
 * @description Base Vitest configuration for all monorepo projects.
 * Explicitly sets worker limits to prevent Tinypool RangeErrors on high-core systems.
 */
export const baseConfig = defineConfig({
  test: {
    globals: true,
    passWithNoTests: true,
    pool: "forks",
    minWorkers: 1,
    maxWorkers: 1,
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
