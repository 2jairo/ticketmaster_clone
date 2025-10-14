import { Route } from '@angular/router';

export const PROFILE_ROUTES: Route[] = [
  {
    path: 'account',
    loadComponent: () => import('../../components/profile-sections/account/account').then(c => c.Account)
  },
  {
    path: 'orders',
    loadComponent: () => import('../../components/profile-sections/orders/orders').then(c => c.Orders)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'account'
  },
]
