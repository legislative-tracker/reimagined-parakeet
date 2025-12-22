import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const stateGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Define only 'ny' and 'nj' as allowed states
  const allowedStates = ['ny', 'nj'];

  // Get the 'state' parameter from the current route snapshot
  const stateParam = route.params['state']?.toLowerCase();

  if (allowedStates.includes(stateParam)) {
    return true; // Navigation allowed
  } else {
    // Redirect to 'ny' if the user tries to enter an unauthorized state
    return router.createUrlTree(['/ny']);
  }
};
