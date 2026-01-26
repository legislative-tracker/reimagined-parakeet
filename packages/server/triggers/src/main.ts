export * from './nightly-sync.trigger.js';
export * from './get-system-status.trigger.js';

import { onRequest } from 'firebase-functions/v2/https';

export const helloWorld = onRequest(async (request, response) => {
  response.send(`Updates completed at ${new Date().toISOString()}`);
});
