import type { Routes } from '@angular/router';
import { adminGuard } from '@legislative-tracker/portal-web-data-access-auth';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [adminGuard],
    title: 'Admin | Legislative Tracker',
    loadComponent: () => import('./admin/admin.component').then((m) => m.Admin),
  },
  // User Management
  {
    path: 'addAdmin',
    canActivate: [adminGuard],
    title: 'Promote User to Admin | Legislative Tracker',
    loadComponent: () =>
      import('./admin-add/admin-add.component').then(
        (m) => m.AdminAddComponent,
      ),
  },
  {
    path: 'removeAdmin',
    canActivate: [adminGuard],
    title: 'Demote Admin | Legislative Tracker',
    loadComponent: () =>
      import('./admin-remove/admin-remove.component').then(
        (m) => m.RemoveAdmin,
      ),
  },
  // Bill Management
  {
    path: 'addBill',
    canActivate: [adminGuard],
    title: 'Add Bill | Legislative Tracker',
    loadComponent: () =>
      import('./bill-add/bill-add.component').then((m) => m.AddBill),
  },
  {
    path: 'removeBill',
    canActivate: [adminGuard],
    title: 'Remove Bill | Legislative Tracker',
    loadComponent: () =>
      import('./bill-remove/bill-remove.component').then((m) => m.RemoveBill),
  },
];
