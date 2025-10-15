import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { UserAuthService } from "../services/userAuth.service";
import { map, take } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private userAuthService = inject(UserAuthService)
  private router = inject(Router)

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return this.userAuthService.isAuthenticated.pipe(
      take(1),
      map((logged) => {
        if(logged) {
          return true
        } else {
          return this.router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } })
        }
      })
    )
  }
}
