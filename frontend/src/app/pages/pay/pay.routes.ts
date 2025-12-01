import { Route } from "@angular/router";
import { PaymentGuard } from "../../guards/payment.guard";

export const PAY_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pay').then(c => c.Pay),
    canActivate: [PaymentGuard]
  },
]
