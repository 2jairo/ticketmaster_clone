import { Routes } from '@angular/router';
import { DETAILS_ROUTES } from './pages/details/details.routes';
import { AUTH_ROUTES } from './pages/auth/auth.routes';
import { EVENTS_ROUTES } from './pages/events/events.routes';
import { USER_ROUTES } from './pages/user/user.routes';


export const routes: Routes = [
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
    path: '**',
    redirectTo: '/',
  }
]

//TODO: category page
