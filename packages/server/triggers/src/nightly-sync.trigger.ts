import { onSchedule } from 'firebase-functions/v2/scheduler';
import { backendConfig } from '@legislative-tracker/shared-config-secrets';
import {
  BillSyncService,
  SponsorSyncService,
} from '@legislative-tracker/server-data-access';

/**
 * @description Scheduled trigger that runs every night at 2 AM to refresh bill data.
 * Secrets are automatically injected into the environment via the PluginFactory.
 */
export const nightlyBillSync = onSchedule(
  {
    schedule: '0 5 * * *',
    secrets: backendConfig.allSecrets,
    timeZone: 'America/New_York',
  },
  async () => {
    const billSync = new BillSyncService();
    const sponsorSync = new SponsorSyncService();

    await billSync.syncAllBills();
    await sponsorSync.syncAllSponsors();
  },
);
