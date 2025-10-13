import { Route } from '@angular/router';

export const EVENTS_ROUTES: Route[] = [
  { path: '', loadComponent: () => import('./events').then(c => c.Events) },
]
