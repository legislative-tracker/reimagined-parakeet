import type { Legislation } from './internal/legislation.model';
import type { Legislator } from './internal/legislator.model';

/**
 * @description Configuration object for initializing a legislative plugin.
 */
export interface PluginConfig {
  /** The API key required to authenticate with the state's legislative data service */
  apiKey: string;
  /** Optional base URL if the state uses different environments (sandbox vs production) */
  baseUrl: string;
}

/**
 * @description Defines the standard contract that every state-specific plugin must implement.
 * This ensures the Server Data-Access layer can iterate through plugins polymorphically.
 */
export interface LegislativePlugin {
  /** The unique ISO-3166-2 code for the state (e.g., 'US-NY', 'US-NJ') */
  stateCode: string;

  /** The name of the jurisdiction (e.g., 'New York', 'New Jersey') */
  stateName: string;

  /**
   * @description Initializes the plugin with necessary credentials.
   * @param config The configuration and secrets needed for API calls.
   */
  initialize(config: PluginConfig): void;

  /**
   * @description Fetches updates for a particular bill.
   * @returns {Promise<Legislation>} A standardized Bill.
   */
  fetchBillUpdates(billId: string): Promise<Legislation>;

  /**
   * @description Fetches all tracked bills for the current legislative session.
   * @returns {Promise<Legislation[]>} A standardized array of Bill objects.
   */
  fetchBills(billId: string[]): Promise<Legislation[]>;

  /**
   * @description Fetches details for members of the legislature.
   * @returns {Promise<Legislator[]>} A standardized array of Legislator objects.
   */
  fetchLegislators(): Promise<Legislator[]>;

  /**
   * @description Validates if the plugin's internal scrapers or API keys are healthy.
   * @returns {Promise<boolean>}
   */
  healthCheck(): Promise<boolean>;
}
