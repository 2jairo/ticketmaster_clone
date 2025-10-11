import { Route } from "@angular/router";
import { NoAuthGuard } from "../../guards/noAuthGuard.service";

export const AUTH_ROUTES: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./auth').then((c) => c.Auth),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'signin',
    loadComponent: () => import('./auth').then((c) => c.Auth),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth').then((c) => c.Auth),
    canActivate: [NoAuthGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'login'
  },
]
