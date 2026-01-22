import type {
  LegislativePlugin,
  PluginConfig,
  Legislation,
  Legislator,
} from '@legislative-tracker/shared-data-models';

/**
 * @description Abstract base class that provides common functionality for all state plugins.
 * This ensures consistent secret handling and reduces boilerplate in specific implementations.
 */
export abstract class BaseLegislaturePlugin implements LegislativePlugin {
  /** The unique state code (e.g., 'US-NJ') defined by the child class */
  abstract readonly stateCode: string;
  abstract readonly stateName: string;

  /** Protected API key accessible to child classes for making authenticated requests */
  protected apiKey?: string;
  protected baseUrl?: string;

  /**
   * @description Standard initialization for all plugins to store credentials.
   * @param {PluginConfig} config Configuration containing the required API key.
   */
  initialize(config: PluginConfig): void {
    if (!config.apiKey) {
      throw new Error(
        `[${this.stateCode}] Initialization failed: apiKey is required.`,
      );
    }
    if (!config.baseUrl) {
      throw new Error(
        `[${this.stateCode}] Plugin not initialized: Missing Base URL`,
      );
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }

  /**
   * @description Default health check implementation.
   * Can be overridden by child classes for more complex connectivity checks.
   * @returns {Promise<boolean>} True if the plugin has been initialized with a key.
   */
  async healthCheck(): Promise<boolean> {
    return Promise.resolve(!!this.apiKey);
  }

  /**
   * @description Abstract method forcing child classes to implement state-specific bill fetching.
   */
  abstract fetchBillUpdates(billId: string): Promise<Legislation>;

  /**
   * @description Abstract method forcing child classes to implement state-specific bill fetching.
   */
  abstract fetchBills(billIds: string[]): Promise<Legislation[]>;

  /**
   * @description Abstract method forcing child classes to implement state-specific member fetching.
   */
  abstract fetchLegislators(ids?: string[]): Promise<Legislator[]>;
}
