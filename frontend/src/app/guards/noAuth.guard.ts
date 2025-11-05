import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from "@angular/router";
import { UserAuthService } from "../services/userAuth.service";
import { map, take, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  private userAuthService = inject(UserAuthService)

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return this.userAuthService.isAuthenticated.pipe(
      take(1),
      map((result) => !result.authenticated),
    )
  }
}
