import { Injectable, inject, signal, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import {
  argbFromHex,
  themeFromSourceColor,
  hexFromArgb,
  Scheme,
} from '@material/material-color-utilities';
import { timeout, catchError, map, take } from 'rxjs/operators';
import { firstValueFrom, of } from 'rxjs';

export interface RuntimeConfig {
  branding: {
    logoUrl: string;
    primaryColor: string;
    faviconUrl?: string;
  };
}

const DEFAULT_CONFIG: RuntimeConfig = {
  branding: {
    logoUrl: 'assets/default-logo.png',
    primaryColor: '#673ab7',
    faviconUrl: 'favicon.ico',
  },
};

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly firestore = inject(Firestore);
  private readonly document = inject(DOCUMENT);

  readonly config = signal<RuntimeConfig>(DEFAULT_CONFIG);

  constructor() {
    // AUTOMATIC: Whenever Firestore updates, this Effect runs
    effect(() => {
      const branding = this.config().branding;

      // 1. Update Colors
      this.applyAngularMaterialTheme(branding.primaryColor);

      // 2. Update Favicon (Only if a URL is provided)
      if (branding.faviconUrl) {
        this.updateFavicon(branding.faviconUrl);
      }
    });
  }

  /**
   * Called by APP_INITIALIZER in app.config.ts
   */
  async load(): Promise<void> {
    const configDoc = doc(this.firestore, 'configurations/global');

    const data$ = docData(configDoc).pipe(
      map((data) => data as RuntimeConfig),
      timeout(3000),
      catchError((err) => {
        console.warn('Config fetch failed, using defaults.', err);
        return of(null);
      })
    );

    // Subscribe for real-time updates
    data$.subscribe((remoteConfig) => {
      if (remoteConfig) {
        this.config.update((current) => ({
          ...current,
          branding: { ...current.branding, ...remoteConfig.branding },
        }));
      }
    });

    // Block app boot until we have the first value
    await firstValueFrom(data$.pipe(take(1)));
  }

  // --- PRIVATE DOM HELPERS ---

  private updateFavicon(url: string) {
    // Find the existing <link rel="icon">
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel*='icon']");

    // If missing, create it
    if (!link) {
      link = this.document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      this.document.head.appendChild(link);
    }

    // Point it to the Firestore URL
    link.href = url;
  }

  private applyAngularMaterialTheme(hexColor: string) {
    try {
      const sourceColor = argbFromHex(hexColor);
      const theme = themeFromSourceColor(sourceColor);
      const scheme = theme.schemes.light;
      const properties = this.flattenSchemeToCssVars(scheme);

      const root = this.document.documentElement;
      for (const [key, value] of Object.entries(properties)) {
        root.style.setProperty(key, value);
      }
    } catch (e) {
      console.error('Failed to generate dynamic theme', e);
    }
  }

  private flattenSchemeToCssVars(scheme: Scheme): Record<string, string> {
    const mapping: Record<string, string> = {};
    const toHex = (argb: number) => hexFromArgb(argb);

    for (const [key, value] of Object.entries(scheme.toJSON())) {
      if (typeof value !== 'number') continue;
      const kebabKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
      mapping[`--mat-sys-color-${kebabKey}`] = toHex(value);
      mapping[`--mat-sys-${kebabKey}`] = toHex(value);
    }
    return mapping;
  }
}
