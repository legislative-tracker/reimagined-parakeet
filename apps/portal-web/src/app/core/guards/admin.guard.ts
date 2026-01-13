import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, switchMap, take } from 'rxjs/operators';
import { from, of } from 'rxjs';

/**
 * A functional route guard that restricts access to administrative routes.
 * @returns An Observable that resolves to 'true' if the user is an admin, or a UrlTree for redirection.
 * @description This guard waits for the Firebase Auth SDK to initialize, retrieves the user's
 * ID token, and verifies the custom 'admin' claim before granting access.
 */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  /**
   * We use authState (an Observable) instead of a Signal here to ensure
   * we wait for the Firebase SDK to initialize before evaluating access.
   */
  return authState(auth).pipe(
    take(1), // Take the first valid auth state (logged in or null)
    switchMap((user) => {
      if (!user) {
        // Not logged in? Redirect to the login page.
        return of(router.createUrlTree(['/login']));
      }

      // User is authenticated; now check for the 'admin' custom claim.
      return from(user.getIdTokenResult()).pipe(
        map((token) => {
          if (token.claims['admin'] === true) {
            return true; // Access granted.
          } else {
            // Authenticated but lacks admin privileges; redirect to home.
            return router.createUrlTree(['/']);
          }
        }),
      );
    }),
  );
};
