import { Routes } from '@angular/router';
import { NavComponent } from './layout/nav/nav.component';
import { stateGuard } from './core/guards/state.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: NavComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'ny',
      },
      // --- Public Static Pages ---
      {
        path: '404',
        loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
        title: '404 | Legislative Tracker',
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about').then((m) => m.About),
        title: 'About | Legislative Tracker',
      },
      {
        path: 'privacy',
        loadComponent: () => import('./pages/privacy/privacy').then((m) => m.Privacy),
        title: 'Privacy Policy | Legislative Tracker',
      },

      // --- Feature: Authentication ---
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
        title: 'Login | Legislative Tracker',
      },

      // --- Feature: Admin ---
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
      },

      // --- Feature: User Profile ---
      {
        path: 'profile',
        loadComponent: () => import('./features/user/profile/profile').then((m) => m.Profile),
        title: 'Profile | Legislative Tracker',
      },

      // --- Feature: Legislative Tracker (State Wildcard) ---
      {
        path: ':stateCd',
        canActivate: [stateGuard],
        loadChildren: () =>
          import('./features/legislative/legislative.routes').then((m) => m.LEGISLATIVE_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
