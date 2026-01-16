import { beforeAll } from "vitest";

/**
 * @description Dynamically imports Firebase utilities to avoid SSR ReferenceErrors.
 */
beforeAll(async () => {
  const { default: firebaseFunctionsTest } = await import(
    "firebase-functions-test"
  );

  /** Initialize the test environment */
  const testEnv = firebaseFunctionsTest();

  /** Store on global scope for use in spec files */
  (globalThis as any).testEnv = testEnv;
});
