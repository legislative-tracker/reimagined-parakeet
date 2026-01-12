import { mergeConfig } from "vitest/config";
import { baseConfig } from "../../../vitest.base.config";

/**
 * @description Vitest configuration for the shared data-models library.
 * This library contains shared DTOs and interfaces used by both
 * the Angular frontend and Firebase backend functions.
 */
export default mergeConfig(baseConfig, {
  test: {
    /** Unique name used by the root workspace runner to identify this project */
    name: "shared-data-models",
    /** Node environment is sufficient for data models and logic utilities */
    environment: "node",
    /** Matches any .spec.ts files within the library's source directory */
    include: ["src/**/*.spec.ts"],
  },
});
