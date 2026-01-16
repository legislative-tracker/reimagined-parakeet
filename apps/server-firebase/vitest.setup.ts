import { beforeAll } from "vitest";
import type { FeaturesList } from "firebase-functions-test/lib/features.js";

/**
 * @description Extends the global namespace to include the Firebase test environment.
 * This ensures that 'globalThis.testEnv' is fully typed throughout the test suite
 * and satisfies the linter's 'no-explicit-any' constraint.
 */
declare global {
  /**
   * @description The initialized firebase-functions-test environment.
   * Using 'var' inside 'declare global' is required for globalThis augmentation.
   */
  var testEnv: FeaturesList;
}

/**
 * @description Global setup for Firebase Cloud Functions testing.
 * Dynamically imports 'firebase-functions-test' to avoid Vite SSR transformation errors
 * while providing type-safe global access to the test environment.
 */
beforeAll(async () => {
  /** * Dynamically load the test utility to ensure it bypasses the Vite SSR transformer.
   * We use the 'default' export as per the firebase-functions-test ESM wrapper.
   */
  const { default: firebaseFunctionsTest } = await import(
    "firebase-functions-test"
  );

  /** * Initialize the test environment and assign it to globalThis.
   * Because of the 'declare global' block above, this is now 100% type-safe.
   */
  globalThis.testEnv = firebaseFunctionsTest();
});
