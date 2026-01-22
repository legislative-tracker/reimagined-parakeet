// import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';

// import { backendConfig } from '@legislative-tracker/shared-config-secrets';
// import { mergeStateAndOSPeopleData } from '@legislative-tracker/plugin-shared-utils';
// import { fetchLegislators } from '@legislative-tracker/plugin-openstates';
// import { fetchMembers } from '@legislative-tracker/plugin-leg-us-ny';
import { getFirestoreLegislation } from '@legislative-tracker/server-data-access';

export const helloWorld = onRequest(async (request, response) => {
  const stateCd = 'us-ny';
  const data = await getFirestoreLegislation(stateCd);

  if (!data)
    throw new Error(
      `Data not found for jurisdiction code ${stateCd.toUpperCase()}`,
    );

  response.send(data);
});
