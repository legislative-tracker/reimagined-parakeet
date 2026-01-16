import { defineConfig, type UserConfig } from "vitest/config";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";

/**
 * @description Consolidated root Vitest configuration.
 * Includes nxViteTsPaths to fix workspace alias resolution across all projects.
 */
export const baseConfig: UserConfig = {
  plugins: [nxViteTsPaths()],
  test: {
    globals: true,
    passWithNoTests: true,
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    reporters: ["default"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
};

export default defineConfig(baseConfig);
