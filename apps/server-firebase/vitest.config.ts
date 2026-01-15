import { defineProject, mergeConfig } from "vitest/config";
import baseConfig from "../../vitest.config.js";

/**
 * @description Vitest project configuration for the server-firebase application.
 * Configures the Node.js testing environment and links to the global workspace setup.
 */
export default mergeConfig(
  baseConfig,
  defineProject({
    test: {
      name: "server-firebase",
      environment: "node",
      setupFiles: ["vitest.setup.ts"],
      include: ["src/**/*.spec.ts", "test/**/*.spec.ts"],
    },
  })
);
