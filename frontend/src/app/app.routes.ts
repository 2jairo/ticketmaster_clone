import { Routes } from '@angular/router';


export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(c => c.Home)},
  { path: 'shop', loadComponent: () => import('./pages/shop/shop').then(c => c.Shop)}
];
