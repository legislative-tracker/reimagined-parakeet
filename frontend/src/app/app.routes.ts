import { Routes } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { stateGuard } from './core/guards/state.guard';
import { authGuard } from './core/guards/auth.guard';
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
      {
        path: '404',
        pathMatch: 'full',
        loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
        title: '404 | Legislative Tracker',
      },

      {
        path: 'about',
        pathMatch: 'full',
        loadComponent: () => import('./pages/about/about').then((m) => m.About),
        title: 'About | Legislative Tracker',
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
        title: 'Login | Legislative Tracker',
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        title: 'Admin | Legislative Tracker',
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
        loadComponent: () => import('./features/user/profile/profile').then((m) => m.Profile),
        title: 'Profile | Legislative Tracker',
      },
      {
        path: 'privacy',
        loadComponent: () => import('./pages/privacy/privacy').then((m) => m.Privacy),
        title: 'Privacy Policy | Legislative Tracker',
      },
      {
        path: ':stateCd',
        pathMatch: 'full',
        canActivate: [stateGuard],
        loadComponent: () =>
          import('./features/legislative/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: ':stateCd/bill/:id',
        loadComponent: () =>
          import('./features/legislative/bill-detail/bill-detail').then((m) => m.BillDetail),
      },

      {
        path: ':stateCd/member/:id',
        loadComponent: () =>
          import('./features/legislative/member-detail/member-detail').then((m) => m.MemberDetail),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
