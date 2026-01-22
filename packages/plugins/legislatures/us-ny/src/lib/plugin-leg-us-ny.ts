import { BaseLegislaturePlugin } from '@legislative-tracker/plugin-shared-utils';
import type {
  Legislation,
  Legislator,
} from '@legislative-tracker/shared-data-models';
import { mapToLegislation } from './map-legislation.js';

/**
 * @description New York plugin implementation handling secret-based authentication.
 */
export class USNYPlugin extends BaseLegislaturePlugin {
  readonly stateCode = 'US-NY';
  readonly stateName = 'New York';

  async fetchBillUpdates(billId: string): Promise<Legislation> {
    const searchParams = new URLSearchParams({
      key: this.apiKey || '',
      view: 'default',
    });

    // NY bills are stored in the format 'S1234-2025'
    const billParts = billId.split('-');
    const url = `${this.baseUrl}/bills/${billParts.pop()}/${billParts.pop()}?${searchParams.toString()}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.success) throw new Error('Failed to fetch NY bill ' + billId);
    if (!data.result) throw new Error('Unexpected response format');

    return mapToLegislation(data.result) as Legislation;
  }

  async fetchBills(billIds: string[]): Promise<Legislation[]> {
    return await Promise.all(
      billIds.map((id: string) => this.fetchBillUpdates(id)),
    );
  }

  async fetchLegislators(): Promise<Legislator[]> {
    if (!this.apiKey) {
      throw new Error(
        `[${this.stateCode}] Plugin not initialized: Missing API Key`,
      );
    }

    // Example: fetch('...', { headers: { 'X-API-KEY': this._apiKey } })
    return [];
  }
}
