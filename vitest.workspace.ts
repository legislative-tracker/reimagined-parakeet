import { defineWorkspace } from "vitest/config";

/**
 * @description Defines the workspace project structure for Vitest 3.
 * Automatically discovers configurations in apps and libs.
 */
export default defineWorkspace([
  "apps/*/vitest.config.ts",
  "libs/*/vitest.config.ts",
  "libs/plugins/**/vitest.config.ts",
]);
