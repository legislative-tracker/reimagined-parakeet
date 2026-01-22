import { logger } from 'firebase-functions/v2';
import { PluginFactory } from './plugin-factory.service.js';

import {
  db,
  getTypedCollection,
} from '@legislative-tracker/shared-config-firebase';
import type { Legislation } from '@legislative-tracker/shared-data-models';

/**
 * @description Service responsible for coordinating the sync process between plugins and Firestore.
 */
export class SponsorSyncService {
  /**
   * @description Orchestrates the fetching of bills from all plugins and updating Sponsorships in Firestore.
   * @returns {Promise<void>}
   */
  async syncAllSponsors(): Promise<void> {
    const plugins = PluginFactory.getInitializedPlugins();
    const bulkWriter = db.bulkWriter();

    for (const plugin of plugins) {
      try {
        logger.info(`Starting sponsor sync for state: ${plugin.stateCode}`);

        const bills = await this._getBills(plugin.stateCode);

        bills.forEach(async (bill: Legislation) => {
          /**
           * Some states use an empty string to signify the initial version of a bill
           * Firestore doesn't allow a map object's key to include nullish values, so
           * we need a placeholder for the value - hence "Original"
           */
          const ver = bill.current_version ? bill.current_version : 'Original';

          // Get the list of cosponsors for the latest version ONLY
          const sponsors = bill.cosponsorships[ver];

          // Make sure the Primary Sponsor is included in the sponsorships array
          if (bill.sponsorships && bill.sponsorships[0].id) {
            sponsors.push({
              id: bill.sponsorships[0].id,
              name: bill.sponsorships[0].name,
            });
          }

          sponsors.forEach((cosponsor) => {
            // We'll store the sponsorships as a subcollection of the Legislator
            // document for easier management with bulkWriter.set()
            const sponsorshipColRef = db.collection(
              `legislatures/${plugin.stateCode}/legislators/${cosponsor.id}/sponsorships`,
            );

            const docRef = sponsorshipColRef.doc(bill.id);

            bulkWriter.set(
              docRef,
              {
                id: bill.id,
                version: ver,
                title: bill.title,
              },
              // Merging ensures that we overwrite the version number if the
              // Legislator cosponsored a previous version of the bill
              { merge: true },
            );
          });

          await bulkWriter.close();
        });

        logger.info(
          `Successfully synced sponsors for ${bills.length} bills in ${plugin.stateCode}`,
        );
      } catch (error) {
        logger.error(`Failed to sync state ${plugin.stateCode}`, error);
      }
    }
  }

  private async _getBills(stateCode: string): Promise<Legislation[]> {
    const path = `legislatures/${stateCode}/legislation`;
    const col = await getTypedCollection<Legislation>(path).get();

    return col.docs.map((doc) => doc.data());
  }
}
