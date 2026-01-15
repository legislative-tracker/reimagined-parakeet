import { defineConfig } from "vitest/config";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin";

/**
 * @description Vitest configuration for the US-NY Legislature plugin.
 * Uses 'vitest/config' to ensure proper type safety and Node.js environment shimming.
 */
export default defineConfig({
  root: __dirname,
  cacheDir: "../../../../../node_modules/.vite/libs/shared/plugins/legislatures/us-ny",
  plugins: [nxViteTsPaths(), nxCopyAssetsPlugin(["*.md"])],
  test: {
    watch: false,
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    coverage: {
      reportsDirectory: "../../../../../coverage/libs/shared/plugins/legislatures/us-ny",
      provider: "v8",
    },
  },
});
