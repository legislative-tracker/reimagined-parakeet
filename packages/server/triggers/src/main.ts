/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';

import { backendConfig } from '@legislative-tracker/shared-config-secrets';
import { fetchMembers } from '@legislative-tracker/plugin-leg-us-ny';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest(async (request, response) => {
  const data = await fetchMembers(backendConfig.usNyApiKey);
  response.send(data);
});
