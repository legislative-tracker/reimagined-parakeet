import { Injectable, inject, signal, effect } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import {
  argbFromHex,
  themeFromSourceColor,
  hexFromArgb, // <--- IMPORT THIS
  Scheme,
} from '@material/material-color-utilities';
import { filter, map, take } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

export interface RuntimeConfig {
  branding: {
    logoUrl: string;
    primaryColor: string;
  };
}

const DEFAULT_CONFIG: RuntimeConfig = {
  branding: {
    logoUrl: 'assets/default-logo.png',
    primaryColor: '#673ab7',
  },
};

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly firestore = inject(Firestore);

  readonly config = signal<RuntimeConfig>(DEFAULT_CONFIG);

  constructor() {
    effect(() => {
      const color = this.config().branding.primaryColor;
      this.applyAngularMaterialTheme(color);
    });
  }

  async load(): Promise<void> {
    const configDoc = doc(this.firestore, 'configurations/global');
    const data$ = docData(configDoc).pipe(map((data) => data as RuntimeConfig));

    data$.subscribe((remoteConfig) => {
      if (remoteConfig) this.config.set({ ...DEFAULT_CONFIG, ...remoteConfig });
    });

    try {
      await firstValueFrom(
        data$.pipe(
          filter((d) => !!d),
          take(1)
        )
      );
    } catch (e) {
      console.warn('Runtime config fetch failed, using defaults.', e);
    }
  }

  private applyAngularMaterialTheme(hexColor: string) {
    try {
      const sourceColor = argbFromHex(hexColor);
      const theme = themeFromSourceColor(sourceColor);
      const scheme = theme.schemes.light;

      const properties = this.flattenSchemeToCssVars(scheme);

      const root = document.documentElement;
      for (const [key, value] of Object.entries(properties)) {
        root.style.setProperty(key, value);
      }
    } catch (e) {
      console.error('Failed to generate dynamic theme', e);
    }
  }

  private flattenSchemeToCssVars(scheme: Scheme): Record<string, string> {
    const mapping: Record<string, string> = {};

    // UPDATED: Use the standalone utility function
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
