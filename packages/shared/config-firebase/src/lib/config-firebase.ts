export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAiHiuJpzdTKQpnUrnMD-Oqkr_iqQvs_1g',
  authDomain: 'legislative-tracker-41022.firebaseapp.com',
  projectId: 'legislative-tracker-41022',
  storageBucket: 'legislative-tracker-41022.firebasestorage.app',
  messagingSenderId: '611689477631',
  appId: '1:611689477631:web:7271e05c18af54a5ebe3ca',
  measurementId: 'G-Q3G5CVP8NK',
};

/**
 * Universal helper to detect if we are in a local development/emulator environment.
 * Works for both the Angular Portal (browser) and Firebase Triggers (Node).
 */
export const isEmulatorEnv = (): boolean => {
  if (typeof window !== 'undefined' && window.location) {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );
  }

  return (
    process.env['FUNCTIONS_EMULATOR'] === 'true' ||
    process.env['NODE_ENV'] === 'development'
  );
};
