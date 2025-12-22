import { Routes } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { stateGuard } from './guards/state-guard';

export const routes: Routes = [
  {
    // The empty path acts as the base layout
    path: '',
    component: NavComponent,
    children: [
      // 1. Default landing page redirects to 'ny'
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'ny',
      },

      // 2. Static pages (About and Profile)
      {
        path: 'about',
        loadComponent: () => import('./home/about/about').then((m) => m.About),
      },
      {
        path: 'profile',
        loadComponent: () => import('./home/profile/profile').then((m) => m.Profile),
      },

      // 3. Dynamic state-based route with the Route Guard
      {
        path: ':state',
        pathMatch: 'full',
        canActivate: [stateGuard],
        loadComponent: () => import('./home/view/view').then((m) => m.View),
      },
      {
        path: ':state/:id',
        pathMatch: 'full',
        canActivate: [stateGuard],
        loadComponent: () => import('./home/view/view').then((m) => m.View),
      },
    ],
  },

  // 4. Wildcard route to catch everything else
  { path: '**', redirectTo: '' },
];
