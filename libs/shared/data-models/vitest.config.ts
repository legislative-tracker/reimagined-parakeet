import { defineProject, mergeConfig } from "vitest/config";
import { baseConfig } from "../../../vitest.config.js";

/**
 * @description Vitest configuration for the shared data-models library.
 * Inherits from the consolidated root to ensure path resolution works for the backend.
 */
export default mergeConfig(
  baseConfig,
  defineProject({
    test: {
      name: "shared-data-models",
      environment: "node",
      include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    },
  })
);
