import { Route } from "@angular/router";

export const SHOP_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./shop').then(c => c.Shop),
  },
]
