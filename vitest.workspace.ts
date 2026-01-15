import { defineWorkspace } from "vitest/config";

/**
 * @description Defines the workspace project structure for Vitest.
 * Automatically discovers configurations in apps and libs.
 * Updated to capture nested shared plugins and support standard naming conventions.
 */
export default defineWorkspace([
  "apps/*/vitest.config.ts",
  "libs/*/vitest.config.ts",
  "libs/shared/**/vitest.config.{ts,js}",
]);
