import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { map, switchMap, take } from "rxjs";
import { ShoppingCartService } from "../services/shoppingCart.service";

@Injectable({
  providedIn: 'root'
})
export class PaymentGuard implements CanActivate {
  private cart = inject(ShoppingCartService)
  private router = inject(Router)

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return this.cart.cartFetched.pipe(
      take(1),
      switchMap(() => this.cart.cart),
      map((cart) => {
        if(cart.merch.length + cart.tickets.length === 0) {
          return this.router.createUrlTree(['/'])
        }
        return true
      })
    )
  }
}
