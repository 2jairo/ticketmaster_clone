import { Route } from "@angular/router";

export const DETAILS_ROUTES: Route[] = [
  { path: ':slug', loadComponent: () => import('./details').then(c => c.Details) },
]
