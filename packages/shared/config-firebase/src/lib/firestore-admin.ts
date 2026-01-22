import type { App } from 'firebase-admin/app';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
// Use 'import type' to ensure zero runtime impact and avoid linter errors
import type { CollectionReference, Firestore } from 'firebase-admin/firestore';

/**
 * @description Initializes and returns the Firebase Admin App instance.
 * Ensures that we don't initialize multiple apps during hot-reloads or concurrent function executions.
 * @returns {App} The initialized Firebase Admin App.
 */
export function getAdminApp(): App {
  if (getApps().length === 0) {
    return initializeApp();
  }
  return getApps()[0];
}

/**
 * @description A pre-configured, singleton instance of the Firestore Admin SDK.
 * Use this instance for all server-side database operations.
 */
export const db: Firestore = getFirestore(getAdminApp());

/**
 * @description Apply global Firestore settings.
 * ignoreUndefinedProperties: true ensures that 'undefined' values in your DTOs
 * are ignored rather than causing the SDK to throw an error.
 */
db.settings({
  ignoreUndefinedProperties: true,
});

/**
 * @description Helper to provide type-safe collection references using Firestore Data Converters.
 * @template T - The interface type from @legislative-tracker/shared-data-models.
 * @param {string} collectionPath - The path to the Firestore collection.
 * @returns {CollectionReference<T>} A typed collection reference.
 */
export const getTypedCollection = <T extends object>(
  collectionPath: string,
): CollectionReference<T> => {
  return db.collection(collectionPath) as CollectionReference<T>;
};
