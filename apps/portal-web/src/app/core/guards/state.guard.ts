import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ImplementedStatesList } from '../app-config/implemented-states.js';

/**
 * A functional route guard that validates the 'stateCd' parameter against a whitelist of implemented states.
 * @param route - The current ActivatedRouteSnapshot containing the route parameters.
 * @returns A boolean allowing navigation if the state is valid, or a UrlTree redirecting to 404 if invalid.
 * @description This guard ensures users cannot navigate to state-specific routes for legislatures
 * that are not yet supported by the application.
 */
export const stateGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  /** List of state codes currently supported by the platform (e.g., 'ny', 'ca') */
  const implementedStates = ImplementedStatesList;

  // Get the 'stateCd' parameter from the current route snapshot
  const stateParam = route.params['stateCd']?.toLowerCase();

  if (implementedStates.includes(stateParam)) {
    return true; // Navigation allowed
  } else {
    // Redirect to home or 404 if the user tries to enter an unauthorized state
    return router.createUrlTree(['/404']);
  }
};
