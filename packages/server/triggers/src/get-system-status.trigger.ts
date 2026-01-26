import * as logger from 'firebase-functions/logger';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { REGISTERED_PLUGINS } from '@legislative-tracker/server-data-access';
import type { SystemStatusResponse } from '@legislative-tracker/shared-data-models';

/**
 * Callable Function: getSystemStatus
 * Returns the configuration of the running backend instance.
 *
 * @returns {SystemStatusResponse} The list of active plugins.
 */
export const getSystemStatus = onCall<void, Promise<SystemStatusResponse>>(
  async () => {
    try {
      // 1. Extract the active plugin keys from the registry
      const enabledLegislatures = REGISTERED_PLUGINS.map(
        (plugin) => plugin.pluginJurisdiction,
      );

      logger.info('System Status Requested', {
        count: enabledLegislatures.length,
      });

      return {
        enabledLegislatures,
        version: process.env['NX_wqAPP_VERSION'] || '1.0.0',
      };
    } catch (error) {
      logger.error('Failed to retrieve system status', error);
      throw new HttpsError('internal', 'Unable to fetch system status');
    }
  },
);
