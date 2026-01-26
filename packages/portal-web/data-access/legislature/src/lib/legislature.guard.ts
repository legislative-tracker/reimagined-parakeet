import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { LegislatureService } from './legislature/legislature.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';

/**
 * A functional route guard that validates the 'stateCd' parameter against the supported states.
 * @param route - The current ActivatedRouteSnapshot containing the route parameters.
 * @returns An Observable that emits true if the state is supported, or a UrlTree for redirection.
 * @description This guard is now asynchronous. It waits for the LegislatureService to finish
 * loading its configuration from the backend before validating the route parameter.
 */
export const legislatureGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const legislatureService = inject(LegislatureService);

  const stateParam = route.params['stateCd'];

  // We convert the loading signal to an observable and wait for 'isLoading' to be false.
  // This prevents the guard from failing simply because the backend hasn't responded yet.
  return toObservable(legislatureService.isLoading).pipe(
    filter((loading) => !loading), // Wait until loading is finished
    take(1), // Complete the stream immediately after receiving the first 'false'
    map(() => {
      if (legislatureService.isStateSupported(stateParam)) {
        return true;
      }

      // If the state is not in the supported list after loading, redirect to 404
      return router.createUrlTree(['/404']);
    }),
  );
};
