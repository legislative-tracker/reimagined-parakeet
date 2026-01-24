import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';

/**
 * A functional route guard that validates the 'stateCd' parameter against a whitelist of implemented states.
 * @param route - The current ActivatedRouteSnapshot containing the route parameters.
 * @returns A boolean allowing navigation if the state is valid, or a UrlTree redirecting to 404 if invalid.
 * @description This guard ensures users cannot navigate to state-specific routes for legislatures
 * that are not yet supported by the application.
 */
export const legislatureGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  /** List of state codes currently supported by the platform (e.g., 'us-ny', 'us-ca') */
  const implementedStates = ['us-ny'];

  // Get the 'stateCd' parameter from the current route snapshot
  const legislatureParam = route.params['stateCd']?.toLowerCase();

  if (implementedStates.includes(legislatureParam)) {
    return true; // Navigation allowed
  } else {
    // Redirect to home or 404 if the user tries to enter an unauthorized state
    return router.createUrlTree(['/404']);
  }
};
