import { Routes } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { stateGuard } from './guards/state-guard';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

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
      {
        path: 'about',
        pathMatch: 'full',
        loadComponent: () => import('./home/about/about').then((m) => m.About),
      },
      {
        path: 'login',
        loadComponent: () => import('./home/login/login').then((m) => m.Login),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () => import('./admin/admin/admin').then((m) => m.Admin),
          },

          {
            path: 'addAdmin',
            loadComponent: () => import('./admin/add-admin/add-admin').then((m) => m.AddAdmin),
          },
          {
            path: 'removeAdmin',
            loadComponent: () =>
              import('./admin/remove-admin/remove-admin').then((m) => m.RemoveAdmin),
          },
        ],
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./profile/profile').then((m) => m.Profile),
      },
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
        loadComponent: () => import('./home/detail/detail').then((m) => m.Detail),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
