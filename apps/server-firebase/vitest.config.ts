import { defineProject, mergeConfig } from "vitest/config";
import { baseConfig } from "../../vitest.config.js";

/**
 * @description Vitest project configuration for the server-firebase application.
 * Inlines workspace libraries to ensure they receive the correct SSR transformation.
 */
export default mergeConfig(
  baseConfig,
  defineProject({
    test: {
      name: "server-firebase",
      environment: "node",
      setupFiles: ["vitest.setup.ts"],
      include: ["src/**/*.spec.ts", "test/**/*.spec.ts"],
      server: {
        deps: {
          /** Externalize Firebase utilities to bypass the transformer */
          external: [/firebase-functions-test/, /firebase-admin/],
          /** Inline all workspace code to ensure SSR shims are injected */
          inline: [/@reimagined-parakeet\/.*/],
        },
      },
    },
  })
);
