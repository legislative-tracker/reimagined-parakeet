import type { Routes } from '@angular/router';

/**
 * Top-level application routes.
 */
export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@legislative-tracker/portal-web-features-shell').then(
        (m) => m.portalWebFeaturesShellRoutes,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
