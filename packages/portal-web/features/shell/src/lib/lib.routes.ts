import type { Route } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

export const portalWebFeaturesShellRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'ny',
      },
      // --- Public Static Pages ---
      //   {
      //     path: '404',
      //     loadComponent: () =>
      //       import('./pages/not-found/not-found').then((m) => m.NotFound),
      //     title: '404 | Legislative Tracker',
      //   },
      {
        path: 'about',
        loadComponent: () =>
          import('@legislative-tracker/portal-web-features-static-pages').then(
            (m) => m.AboutComponent,
          ),
        title: 'About | Legislative Tracker',
      },
      {
        path: 'privacy',
        loadComponent: () =>
          import('@legislative-tracker/portal-web-features-static-pages').then(
            (m) => m.PrivacyComponent,
          ),
        title: 'Privacy Policy | Legislative Tracker',
      },

      // --- Feature: Authentication ---
      {
        path: 'login',
        loadComponent: () =>
          import('@legislative-tracker/portal-web-features-login').then(
            (m) => m.LoginComponent,
          ),
        title: 'Login | Legislative Tracker',
      },

      // --- Feature: Admin ---
      //   {
      //     path: 'admin',
      //     canActivate: [adminGuard],
      //     loadChildren: () =>
      //       import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
      //   },

      // --- Feature: User Profile ---
      {
        path: 'profile',
        loadComponent: () =>
          import('@legislative-tracker/portal-web-features-user-profile').then(
            (m) => m.ProfileComponent,
          ),
        title: 'Profile | Legislative Tracker',
      },

      // --- Feature: Legislative Tracker (State Wildcard) ---
      //   {
      //     path: ':stateCd',
      //     canActivate: [stateGuard],
      //     loadChildren: () =>
      //       import('./features/legislative/legislative.routes').then(
      //         (m) => m.LEGISLATIVE_ROUTES,
      //       ),
      //   },
    ],
  },
  { path: '**', redirectTo: '' },
];
