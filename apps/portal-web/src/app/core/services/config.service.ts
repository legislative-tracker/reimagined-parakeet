import { Injectable, inject, signal, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { timeout, catchError, map, take } from 'rxjs/operators';
import { firstValueFrom, of } from 'rxjs';
import { FirebaseApp } from '@angular/fire/app';

// App imports
import { RuntimeConfig, ResourceLink, DEFAULT_CONFIG } from '../../models/runtime-config.js';

/**
 * Static resource link for the project's source code.
 */
const GITHUB_RESOURCE: ResourceLink = {
  title: 'GitHub Repository',
  description: 'Access the source code under GNU AGPL v3.0.',
  url: 'https://github.com/legislative-tracker/reimagined-parakeet/',
  icon: 'code',
  actionLabel: 'View Code',
};

/**
 * Internal interface representing the shape of a Material Color Utilities Scheme object.
 */
interface MaterialScheme {
  /** Serializes the scheme to a plain object for iteration */
  toJSON(): Record<string, unknown>;
}

/**
 * Service responsible for managing application-wide configuration and branding.
 * @description Handles dynamic theme generation using Material Color Utilities,
 * synchronization with Firestore, and reactive configuration updates via Signals.
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly document = inject(DOCUMENT);
  private readonly app = inject(FirebaseApp);

  /**
   * Current application configuration state.
   */
  public readonly config = signal<RuntimeConfig>(DEFAULT_CONFIG);

  constructor() {
    /**
     * Effect to reactively update the UI when branding configuration changes.
     */
    effect(() => {
      const branding = this.config().branding;

      if (branding.faviconUrl) {
        this.updateFavicon(branding.faviconUrl);
      }

      this.applyAngularMaterialTheme(branding.primaryColor);
    });
  }

  /**
   * Persists new configuration partials to Firestore and updates the local state.
   * @param newConfig - The configuration properties to update.
   * @returns A promise that resolves when the save operation completes.
   */
  public async save(newConfig: Partial<RuntimeConfig>): Promise<void> {
    try {
      const { getFirestore, doc, setDoc } = await import('@angular/fire/firestore');

      const firestore = getFirestore(this.app);
      const configDoc = doc(firestore, 'configurations/global');

      await setDoc(configDoc, newConfig, { merge: true });

      this.config.update((current) => ({ ...current, ...newConfig }));
    } catch (e: unknown) {
      console.error('Failed to save configuration', e);
      throw e;
    }
  }

  /**
   * Loads the global configuration from Firestore.
   * @description Falls back to default configuration if the remote fetch fails or times out.
   */
  public async load(): Promise<void> {
    try {
      const { getFirestore, doc, docData } = await import('@angular/fire/firestore');

      const firestore = getFirestore(this.app);
      const configDoc = doc(firestore, 'configurations/global');

      const data$ = docData(configDoc).pipe(
        map((data) => data as RuntimeConfig),
        timeout(3000),
        catchError((err: unknown) => {
          console.warn('Config fetch failed, using defaults.', err);
          return of(null);
        }),
      );

      data$.subscribe((remoteConfig) => {
        if (remoteConfig) {
          this.config.update((current) => {
            const dynamicResources = remoteConfig.resources || [];
            const uniqueDynamic = dynamicResources.filter((r) => r.url !== GITHUB_RESOURCE.url);

            return {
              ...current,
              organization: { ...current.organization, ...remoteConfig.organization },
              branding: { ...current.branding, ...remoteConfig.branding },
              resources: [GITHUB_RESOURCE, ...uniqueDynamic],
            };
          });
        }
      });

      await firstValueFrom(data$.pipe(take(1)));
    } catch (e: unknown) {
      console.error('Error loading config', e);
      return Promise.resolve();
    }
  }

  /**
   * Updates the application favicon in the document head.
   * @param url - The new favicon URL.
   */
  private updateFavicon(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel*='icon']");
    if (!link) {
      link = this.document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }

  /**
   * Generates and applies a dynamic theme based on a source hex color.
   * @param hexColor - The primary brand color in hex format.
   * @description Uses @material/material-color-utilities to derive a full color scheme
   * and injects it as CSS custom properties into the document root.
   */
  private async applyAngularMaterialTheme(hexColor: string): Promise<void> {
    try {
      const { argbFromHex, themeFromSourceColor, hexFromArgb } =
        await import('@material/material-color-utilities');

      /**
       * Maps a Material scheme object to a flat set of CSS variables.
       * @param scheme - The scheme instance to flatten.
       */
      const flattenSchemeToCssVars = (scheme: MaterialScheme): Record<string, string> => {
        const mapping: Record<string, string> = {};
        const toHex = (argb: number) => hexFromArgb(argb);

        for (const [key, value] of Object.entries(scheme.toJSON())) {
          if (typeof value !== 'number') continue;
          const kebabKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
          mapping[`--mat-sys-color-${kebabKey}`] = toHex(value);
          mapping[`--mat-sys-${kebabKey}`] = toHex(value);
        }
        return mapping;
      };

      const sourceColor = argbFromHex(hexColor);
      const theme = themeFromSourceColor(sourceColor);
      const scheme = theme.schemes.light;
      const properties = flattenSchemeToCssVars(scheme as unknown as MaterialScheme);

      const root = this.document.documentElement;
      for (const [key, value] of Object.entries(properties)) {
        root.style.setProperty(key, value);
      }
    } catch (e: unknown) {
      console.error('Failed to generate dynamic theme', e);
    }
  }
}
