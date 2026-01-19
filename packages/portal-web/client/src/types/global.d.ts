export {};

declare global {
  interface Window {
    /**
     * Set to true or a string token to enable App Check debug mode.
     * @see https://firebase.google.com/docs/app-check/web/debug-provider
     */
    FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
  }
}
