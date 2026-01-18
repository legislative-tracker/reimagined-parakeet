import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { APP_CONFIG, AppConfig } from './core/app-config/app-config-token.js';
import { ConfigService } from './core/services/config.service.js';
import { routes } from './app.routes.js';
import { errorInterceptor } from '@reimagined-parakeet/shared/util-ui';

export const getAppConfig = (runtimeConfig: AppConfig): ApplicationConfig => {
  return {
    providers: [
      { provide: APP_CONFIG, useValue: runtimeConfig },

      provideZonelessChangeDetection(),
      provideAnimationsAsync(),

      provideHttpClient(withInterceptors([errorInterceptor])),

      provideRouter(
        routes,
        withComponentInputBinding(),
        withRouterConfig({ paramsInheritanceStrategy: 'always' }),
      ),

      provideFirebaseApp(() => initializeApp(inject(APP_CONFIG).firebase)),
      provideAuth(() => getAuth()),
      provideAnalytics(() => getAnalytics()),
      ScreenTrackingService,
      UserTrackingService,

      provideAppInitializer(() => inject(ConfigService).load()),
    ],
  };
};
