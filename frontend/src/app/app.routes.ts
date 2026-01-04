import { Routes } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { stateGuard } from './core/state-guard';
import { authGuard } from './core/auth-guard';
import { adminGuard } from './core/admin-guard';
import { Privacy } from './legal/privacy/privacy';

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
        path: '404',
        pathMatch: 'full',
        loadComponent: () => import('./shared/not-found/not-found').then((m) => m.NotFound),
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
            loadComponent: () =>
              import('./admin/user-mgmt/add-admin/add-admin').then((m) => m.AddAdmin),
          },
          {
            path: 'removeAdmin',
            loadComponent: () =>
              import('./admin/user-mgmt/remove-admin/remove-admin').then((m) => m.RemoveAdmin),
          },
          {
            path: 'addBill',
            loadComponent: () =>
              import('./admin/bill-mgmt/add-bill/add-bill').then((m) => m.AddBill),
          },
          {
            path: 'removeBill',
            loadComponent: () =>
              import('./admin/bill-mgmt/remove-bill/remove-bill').then((m) => m.RemoveBill),
          },
        ],
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./home/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'privacy',
        loadComponent: () => import('./legal/privacy/privacy').then((m) => m.Privacy),
        title: 'Privacy Policy | Legislative Tracker', // Sets browser tab title
      },
      {
        path: ':stateCd',
        pathMatch: 'full',
        canActivate: [stateGuard],
        loadComponent: () => import('./home/view/view').then((m) => m.View),
      },
      {
        path: ':stateCd/bill/:id',
        loadComponent: () =>
          import('./home/detail/bill-detail/bill-detail').then((m) => m.BillDetail),
      },

      {
        path: ':stateCd/member/:id',
        loadComponent: () =>
          import('./home/detail/member-detail/member-detail').then((m) => m.MemberDetail),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
