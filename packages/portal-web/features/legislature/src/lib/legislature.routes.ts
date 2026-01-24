import type { Routes } from '@angular/router';
import { legislatureGuard } from '@legislative-tracker/portal-web-data-access-legislature';

export const LEGISLATURE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [legislatureGuard],
    title: 'Dashboard | Legislative Tracker',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'bill/:id',
    canActivate: [legislatureGuard],
    title: 'Bill | Legislative Tracker',
    loadComponent: () =>
      import('./detail-bill/detail-bill.component').then((m) => m.BillDetail),
  },
  {
    path: 'member/:id',
    canActivate: [legislatureGuard],
    title: 'Member | Legislative Tracker',
    loadComponent: () =>
      import('./detail-member/detail-member.component').then(
        (m) => m.MemberDetailComponent,
      ),
  },
];
