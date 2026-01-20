import { defineSecret } from 'firebase-functions/params';

/**
 * @description Backend-only secrets definition using Firebase Functions v2 API.
 * These parameters are resolved at runtime from Google Cloud Secret Manager.
 */
const OPEN_STATES_API_KEY_PARAM = defineSecret('OPEN_STATES_API_KEY');
const GOOGLE_MAPS_API_KEY_PARAM = defineSecret('GOOGLE_MAPS_API_KEY');
const US_NY_API_KEY_PARAM = defineSecret('US_NY_API_KEY');

/**
 * @description Configuration provider for Cloud Functions and backend triggers.
 * Provides a unified interface for accessing sensitive credentials with built-in
 * support for Vitest environment mocking.
 */
export const backendConfig = {
  /**
   * @description Retrieves the Open States API Key.
   * @returns {string} The plaintext API key.
   */
  get openStatesApiKey(): string {
    if (process.env['NODE_ENV'] === 'test') {
      return process.env['OPEN_STATES_API_KEY'] || 'test-open-states-key';
    }
    return OPEN_STATES_API_KEY_PARAM.value();
  },

  /**
   * @description Retrieves the Google Maps API Key for server-side geocoding or validation.
   * @returns {string} The plaintext API key.
   */
  get googleMapsApiKey(): string {
    if (process.env['NODE_ENV'] === 'test') {
      return process.env['GOOGLE_MAPS_API_KEY'] || 'test-google-maps-key';
    }
    return GOOGLE_MAPS_API_KEY_PARAM.value();
  },

  /**
   * @description Retrieves the specific API Key for New York State legislative data.
   * @returns {string} The plaintext API key.
   */
  get usNyApiKey(): string {
    if (process.env['NODE_ENV'] === 'test') {
      return process.env['US_NY_API_KEY'] || 'test-ny-api-key';
    }
    return US_NY_API_KEY_PARAM.value();
  },

  /**
   * @description A comprehensive list of all defined secrets.
   * MUST be passed to the function configuration in 'packages/server/triggers'
   * to grant runtime access permissions.
   */
  allSecrets: [
    OPEN_STATES_API_KEY_PARAM,
    GOOGLE_MAPS_API_KEY_PARAM,
    US_NY_API_KEY_PARAM,
  ],
};
