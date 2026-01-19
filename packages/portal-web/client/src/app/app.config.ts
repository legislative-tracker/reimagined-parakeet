import {
  type ApplicationConfig,
  provideZonelessChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { appRoutes } from './app.routes';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
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
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';

import {
  FIREBASE_CONFIG,
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
    /**
     * Enables Zoneless Change Detection. This requires the removal of 'zone.js'
     * from the polyfills array in project.json to take full effect.
     */
    provideZonelessChangeDetection(),

    /**
     * Configures global error listeners for the browser environment.
     */
    provideBrowserGlobalErrorListeners(),

    /**
     * Sets up the application router with defined routes.
     */
    provideRouter(appRoutes),

    /**
     * Configures asynchronous animations for Angular Material, ensuring
     * the animation engine is loaded lazily for better initial load performance.
     */
    provideAnimationsAsync(),

    /**
     * Initializes the core Firebase application using credentials from
     * the shared-config-firebase library.
     */
    provideFirebaseApp(() => initializeApp(FIREBASE_CONFIG)),

    /**
     * Configures Firebase App Check with reCAPTCHA Enterprise.
     * * In local development or emulator environments, it activates a debug
     * provider by setting a global debug token flag, allowing the developer
     * to bypass reCAPTCHA and use a debug token from the browser console.
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
     * Provides Firebase Authentication service.
     */
    provideAuth(() => getAuth()),

    /**
     * Provides Cloud Firestore database service.
     */
    provideFirestore(() => getFirestore()),

    /**
     * Provides Cloud Functions service for calling backend logic.
     */
    provideFunctions(() => getFunctions()),

    /**
     * Provides Firebase Cloud Messaging for push notifications.
     */
    provideMessaging(() => getMessaging()),

    /**
     * Provides Google Analytics for Firebase.
     */
    provideAnalytics(() => getAnalytics()),

    /**
     * Services for automatic screen and user tracking in Google Analytics.
     */
    ScreenTrackingService,
    UserTrackingService,
  ],
};
