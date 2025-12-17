import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./home/home').then((m) => m.Home) },
  { path: 'about', loadComponent: () => import('./about/about').then((m) => m.About) },
  { path: 'profile', loadComponent: () => import('./profile/profile').then((m) => m.Profile) },
  { path: 'myreps', loadComponent: () => import('./myreps/myreps').then((m) => m.MyReps) },
  { path: '**', redirectTo: '' },
];
