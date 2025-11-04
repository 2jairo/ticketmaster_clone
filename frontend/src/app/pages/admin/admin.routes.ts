import { Route } from "@angular/router";

export const DEFAULT_ADMIN_ROUTE_SECTION = 'concerts'

export const ADMIN_ROUTES: Route[] = [
  {
    path: 'concerts',
    loadComponent: () => import('../../components/admin-sections/concerts/concerts').then(c => c.Concerts),
  },
  {
    path: '**',
    pathMatch: "full",
    redirectTo: DEFAULT_ADMIN_ROUTE_SECTION
  }
]
