import { Routes } from '@angular/router';
import { DETAILS_ROUTES } from './pages/details/details.routes';
import { AUTH_ROUTES } from './pages/auth/auth.routes';


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
    loadComponent: () => import('./pages/events/events').then(c => c.Events),
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
    path: '**',
    redirectTo: '/',
  }
]

//TODO: category page
