import { Routes } from '@angular/router';


export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(c => c.Home) },
  { path: 'events', loadComponent: () => import('./pages/events/events').then(c => c.Events) },
  { path: 'details/:slug', loadComponent: () => import('./pages/details/details').then(c => c.Details) }
];
