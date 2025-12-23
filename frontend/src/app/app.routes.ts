import { Routes } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { stateGuard } from './guards/state-guard';
import { authGuard } from './guards/auth-guard';

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
