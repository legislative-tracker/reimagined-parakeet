import type { LegislativePlugin } from '@legislative-tracker/shared-data-models';
import { REGISTERED_PLUGINS } from './plugin-registry.config.js';

/**
 * @description Factory service to instantiate and initialize plugins safely.
 */
export class PluginFactory {
  /**
   * @description Creates instances of plugins from the registry.
   * Because of the PluginConstructor type, we no longer need type assertions like 'as any'.
   * @returns {LegislativePlugin[]} Ready-to-use plugin instances.
   */
  static getInitializedPlugins(): LegislativePlugin[] {
    return REGISTERED_PLUGINS.map(({ pluginClass, secret, apiUrl }) => {
      // TypeScript now knows 'instance' is a LegislativePlugin
      const instance = new pluginClass();

      instance.initialize({
        apiKey: secret.value(),
        baseUrl: apiUrl,
      });

      return instance;
    });
  }
}
