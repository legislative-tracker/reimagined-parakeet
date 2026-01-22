// import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';

export const helloWorld = onRequest(async (request, response) => {
  response.send(`Updates completed at ${new Date().toISOString()}`);
});
