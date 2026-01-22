import { logger } from 'firebase-functions/v2';
import type { Legislation } from '@legislative-tracker/shared-data-models';

import {
  db,
  getTypedCollection,
} from '@legislative-tracker/shared-config-firebase';
import { PluginFactory } from './plugin-factory.service.js';

/**
 * @description Service responsible for coordinating the sync process between plugins and Firestore.
 */
export class BillSyncService {
  /**
   * @description Orchestrates the fetching of bills from all plugins and updating Firestore.
   * @returns {Promise<void>}
   */
  async syncAllBills(): Promise<void> {
    const plugins = PluginFactory.getInitializedPlugins();

    for (const plugin of plugins) {
      try {
        logger.info(`Starting sync for state: ${plugin.stateCode}`);

        const billList = await this._getBills(plugin.stateCode);
        const bills = await plugin.fetchBills(billList);
        await this._updateFirestore(plugin.stateCode, bills);

        logger.info(
          `Successfully synced ${bills.length} bills for ${plugin.stateCode}`,
        );
      } catch (error) {
        logger.error(`Failed to sync state ${plugin.stateCode}`, error);
      }
    }
  }

  /**
   * @description Performs a batch write to Firestore for efficiency.
   * @param {Legislation[]} bills The list of standardized bills from the plugin.
   * @private
   */
  private async _updateFirestore(
    stateCode: string,
    bills: Legislation[],
  ): Promise<void> {
    const bulkWriter = db.bulkWriter();

    bills.forEach((bill) => {
      const path = `/legislatures/${stateCode}/legislation`;

      // Use stateCode and bill ID to create a unique document path
      const docRef = db.collection(path).doc(bill.id);
      bulkWriter.set(docRef, bill, { merge: true });
    });

    await bulkWriter.close();
  }

  private async _getBills(stateCode: string): Promise<string[]> {
    const path = `legislatures/${stateCode}/legislation`;
    const col = await getTypedCollection<Legislation>(path).get();

    return col.docs.map((doc) => doc.id);
  }
}
