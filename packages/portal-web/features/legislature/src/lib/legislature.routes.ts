import type { Routes } from '@angular/router';

export const LEGISLATURE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Dashboard | Legislative Tracker',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'bill/:id',
    title: 'Bill | Legislative Tracker',
    loadComponent: () =>
      import('./detail-bill/detail-bill.component').then((m) => m.BillDetail),
  },
  {
    path: 'member/:id',
    title: 'Member | Legislative Tracker',
    loadComponent: () =>
      import('./detail-member/detail-member.component').then(
        (m) => m.MemberDetailComponent,
      ),
  },
];
