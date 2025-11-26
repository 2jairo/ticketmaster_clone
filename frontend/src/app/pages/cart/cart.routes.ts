import { Route } from "@angular/router";

export const CART_ROUTES: Route[] = [
  { path: '', loadComponent: () => import('./cart').then(c => c.Cart) },
]
