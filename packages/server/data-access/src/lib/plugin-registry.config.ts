import type { SecretParam } from 'firebase-functions/params';
import type { LegislativePlugin } from '@legislative-tracker/shared-data-models';
import { backendConfig } from '@legislative-tracker/shared-config-secrets';

import { USNYPlugin } from '@legislative-tracker/plugin-leg-us-ny';

/**
 * @description A constructor type that ensures the class can be instantiated
 * and that it adheres to the LegislativePlugin interface.
 */
type PluginConstructor = new () => LegislativePlugin;

/**
 * @description Metadata interface to map a Plugin Class to its specific secret.
 */
interface PluginRegistration {
  pluginClass: PluginConstructor; // The Class definition
  secret: SecretParam;
  apiUrl: string;
}

/**
 * @description The single source of truth for registered state plugins.
 * To add a new state, simply add one line to this array.
 */
export const REGISTERED_PLUGINS: PluginRegistration[] = [
  {
    pluginClass: USNYPlugin,
    secret: backendConfig.allSecrets.find(
      (s) => s.name === 'US_NY_API_KEY',
    ) as SecretParam,
    apiUrl: 'https://legislation.nysenate.gov/api/3',
  },
];
