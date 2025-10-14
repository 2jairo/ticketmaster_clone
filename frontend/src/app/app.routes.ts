import { Routes } from '@angular/router';
import { DETAILS_ROUTES } from './pages/details/details.routes';
import { AUTH_ROUTES } from './pages/auth/auth.routes';
import { EVENTS_ROUTES } from './pages/events/events.routes';
import { PROFILE_ROUTES } from './pages/profile/profile.routes';


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
    path: 'profile',
    children: PROFILE_ROUTES,
    loadComponent: () => import('./pages/profile/profile').then(c => c.Profile)
  },
  {
    path: '**',
    redirectTo: '/',
  }
]

//TODO: category page
