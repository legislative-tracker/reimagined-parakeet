import {
  type ApplicationConfig,
  provideZonelessChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth, connectAuthEmulator } from '@angular/fire/auth';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  provideAppCheck,
} from '@angular/fire/app-check';
import {
  getFirestore,
  provideFirestore,
  connectFirestoreEmulator,
} from '@angular/fire/firestore';
import {
  getFunctions,
  provideFunctions,
  connectFunctionsEmulator,
} from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import {
  getStorage,
  provideStorage,
  connectStorageEmulator,
} from '@angular/fire/storage';

import {
  FIREBASE_CONFIG,
  FIREBASE_EMULATOR_PORTS,
  isEmulatorEnv,
} from '@legislative-tracker/shared-config-firebase';

/**
 * Application configuration for the Portal Web Client.
 * * This configuration leverages Angular v20's zoneless change detection to eliminate
 * dependency on zone.js, improving performance and debugging clarity. Firebase
 * services are initialized using a shared configuration library to ensure
 * symmetry across the monorepo.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideAnimationsAsync(),

    /**
     * Initializes the core Firebase application.
     */
    provideFirebaseApp(() => initializeApp(FIREBASE_CONFIG)),

    /**
     * Configures Firebase App Check.
     * Activates debug tokens when running in the emulator to bypass reCAPTCHA.
     */
    provideAppCheck(() => {
      if (isEmulatorEnv()) {
        self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }

      const provider = new ReCaptchaEnterpriseProvider(
        FIREBASE_CONFIG.recaptchaSiteKey,
      );

      return initializeAppCheck(undefined, {
        provider,
        isTokenAutoRefreshEnabled: true,
      });
    }),

    /**
     * Provides Firebase Authentication with Emulator support.
     */
    provideAuth(() => {
      const auth = getAuth();
      if (isEmulatorEnv()) {
        connectAuthEmulator(
          auth,
          `http://localhost:${FIREBASE_EMULATOR_PORTS.auth}`,
        );
      }
      return auth;
    }),

    /**
     * Provides Cloud Firestore with Emulator support.
     */
    provideFirestore(() => {
      const firestore = getFirestore();
      if (isEmulatorEnv()) {
        connectFirestoreEmulator(
          firestore,
          'localhost',
          FIREBASE_EMULATOR_PORTS.firestore,
        );
      }
      return firestore;
    }),

    /**
     * Provides Cloud Functions with Emulator support.
     */
    provideFunctions(() => {
      const functions = getFunctions();
      if (isEmulatorEnv()) {
        connectFunctionsEmulator(
          functions,
          'localhost',
          FIREBASE_EMULATOR_PORTS.functions,
        );
      }
      return functions;
    }),

    /**
     * Provides Firebase Storage with Emulator support.
     */
    provideStorage(() => {
      const storage = getStorage();
      if (isEmulatorEnv()) {
        connectStorageEmulator(
          storage,
          'localhost',
          FIREBASE_EMULATOR_PORTS.storage,
        );
      }
      return storage;
    }),

    provideMessaging(() => getMessaging()),
    provideAnalytics(() => getAnalytics()),

    ScreenTrackingService,
    UserTrackingService,
  ],
};
