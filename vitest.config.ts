import { defineConfig } from "vitest/config";

/**
 * @description Global Vitest configuration for the Reimagined Parakeet monorepo.
 * Consolidates stability settings (worker limits) and runner settings (reporters, coverage).
 * This serves as the primary "Source of Truth" that all apps and libs should inherit.
 */
export default defineConfig({
  test: {
    /** Enable global access to Vitest APIs (describe, it, expect) without explicit imports */
    globals: true,
    /** Prevents CI failure when a project or library contains no test files */
    passWithNoTests: true,
    /** * Resource Management:
     * Uses 'forks' and strictly limits workers to prevent Tinypool RangeErrors
     * and memory exhaustion on high-core development machines or CI runners.
     */
    pool: "forks",
    minWorkers: 1,
    maxWorkers: 1,
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    /** Standardized reporting for consistent developer feedback */
    reporters: ["default"],
    /** Centralized coverage configuration using the high-performance V8 engine */
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
