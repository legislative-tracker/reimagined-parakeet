// import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';

import { backendConfig } from '@legislative-tracker/shared-config-secrets';
// import { mergeStateAndOSPeopleData } from '@legislative-tracker/plugin-shared-utils';
// import { fetchLegislators } from '@legislative-tracker/plugin-openstates';
import { fetchBills } from '@legislative-tracker/plugin-leg-us-ny';
import { updateFirestoreLegislation } from '@legislative-tracker/server-data-access';
import type { Legislation } from '@legislative-tracker/shared-data-models';

export const helloWorld = onRequest(
  {
    secrets: backendConfig.allSecrets,
  },
  async (request, response) => {
    const stateCd = 'us-ny';

    const bills = await fetchBills(['S4465-2025'], backendConfig.usNyApiKey);

    await updateFirestoreLegislation(stateCd, bills as Legislation[]);

    response.send(bills);
  },
);
