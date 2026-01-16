import { defineProject, mergeConfig } from "vitest/config";
import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin";
import { baseConfig } from "../../../../vitest.config.js";

/**
 * @description Vitest configuration for the US-NY Legislature plugin.
 * Uses surgical inlining for workspace packages to ensure correct alias resolution.
 */
export default mergeConfig(
  baseConfig,
  defineProject({
    plugins: [nxCopyAssetsPlugin(["*.md"])],
    test: {
      name: "plugin-leg-us-ny",
      environment: "node",
      include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      server: {
        deps: {
          /** * Ensures our internal TypeScript libraries are processed by
           * Vitest while leaving third-party Node modules to the native runtime.
           */
          inline: [/@reimagined-parakeet\/.*/],
        },
      },
    },
  })
);
