import { defineConfig, mergeConfig } from "vitest/config";
import type { UserConfig } from "vite";
import { baseConfig } from "../../../vitest.base.config.js";

/**
 * @description Vitest configuration for the shared data-models library.
 * This library contains shared DTOs and interfaces used by both
 * the Angular frontend and Firebase backend functions.
 */
export default mergeConfig(
  baseConfig as UserConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "node",
      include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      reporters: ["default"],
      coverage: {
        reportsDirectory: "../../../coverage/libs/shared/data-models",
        provider: "v8",
      },
    },
  })
);
