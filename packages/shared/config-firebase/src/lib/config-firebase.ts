/**
 * Production Firebase configuration object.
 * These values are safe to be public as they are used by the client-side SDK.
 */
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAiHiuJpzdTKQpnUrnMD-Oqkr_iqQvs_1g',
  authDomain: 'legislative-tracker-41022.firebaseapp.com',
  projectId: 'legislative-tracker-41022',
  storageBucket: 'legislative-tracker-41022.firebasestorage.app',
  messagingSenderId: '611689477631',
  appId: '1:611689477631:web:7271e05c18af54a5ebe3ca',
  measurementId: 'G-Q3G5CVP8NK',
  recaptchaSiteKey: '6LeS2k8sAAAAAP7QS4slTJ3fQQZLPpaYXcA3ikTH',
};

/**
 * Port configurations for Firebase Emulators.
 * These must match the values defined in the root firebase.json file.
 */
export const FIREBASE_EMULATOR_PORTS = {
  auth: 9099,
  functions: 5001,
  firestore: 8080,
  database: 9000,
  hosting: 5000,
  storage: 9199,
};

/**
 * Universal helper to detect if the current execution environment is a local development/emulator environment.
 * * For the browser: Checks the hostname for localhost or 127.0.0.1.
 * * For Node.js (Cloud Functions): Checks the standard Firebase emulator environment variable.
 *
 * @returns {boolean} True if running in an emulator environment.
 */
export const isEmulatorEnv = (): boolean => {
  if (typeof window !== 'undefined' && window.location) {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );
  }

  const globalProcess = typeof process !== 'undefined' ? process : null;

  if (globalProcess && globalProcess.env) {
    return (
      globalProcess.env['FUNCTIONS_EMULATOR'] === 'true' ||
      globalProcess.env['NODE_ENV'] === 'development'
    );
  }

  return false;
};
