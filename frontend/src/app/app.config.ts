import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';

import { APP_CONFIG } from './core/app-config/app-config-token';
import { ConfigService } from './core/services/config-service';
import { routes } from './app.routes';
import { env } from '../environments/prod';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_CONFIG, useValue: env },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' })
    ),
    provideFirebaseApp(() => initializeApp(inject(APP_CONFIG).firebase)),

    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,

    provideAppInitializer(() => inject(ConfigService).load()),
  ],
};
