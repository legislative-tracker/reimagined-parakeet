import { mergeConfig } from "vitest/config";
import { baseConfig } from "../../vitest.base.config";

/**
 * @description Vitest configuration for the Firebase backend.
 * Configured for Node.js to support Firebase Cloud Functions and Admin SDK testing.
 */
export default mergeConfig(baseConfig, {
  test: {
    /** Unique identifier for the root workspace runner */
    name: "server-firebase",
    /** * Firebase functions run in a Node environment.
     * Standardizing on 'node' prevents errors with native modules.
     */
    environment: "node",
    /** * Points to the existing backend source and test files.
     * Respects the original project's file structure.
     */
    include: ["src/**/*.spec.ts", "test/**/*.spec.ts"],
    /** Path to the Firebase test setup file if migration is required */
    setupFiles: ["./test.setup.ts"],
  },
});
