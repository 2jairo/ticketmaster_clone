import { Routes } from '@angular/router';
import { DETAILS_ROUTES } from './pages/details/details.routes';
import { AUTH_ROUTES } from './pages/auth/auth.routes';
import { EVENTS_ROUTES } from './pages/events/events.routes';
import { USER_ROUTES } from './pages/user/user.routes';
import { ADMIN_ROUTES } from './pages/admin/admin.routes';
import { CART_ROUTES } from './pages/cart/cart.routes';


export const routes: Routes = [
  // role: client
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(c => c.Home),
  },
  {
    path: 'home',
    redirectTo: '/'
  },
  {
    path: 'events',
    children: EVENTS_ROUTES,
  },
  {
    path: 'details',
    children: DETAILS_ROUTES,
  },
  {
    path: 'auth',
    children: AUTH_ROUTES,
  },
  {
    path: 'user',
    children: USER_ROUTES,
    loadComponent: () => import('./pages/user/user').then(c => c.User)
  },
  {
    path: 'cart',
    children: CART_ROUTES,
  },

  // role: admin
  {
    path: 'admin-dashboard',
    children: ADMIN_ROUTES,
    loadComponent: () => import('./pages/admin/admin').then(c => c.Admin)
  },


  {
    path: '**',
    redirectTo: '/',
  }
]

//TODO: category page
