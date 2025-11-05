import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { UserAuthService } from "../services/userAuth.service";
import { map, take } from "rxjs";
import { UserRole } from "../types/userAuth";

@Injectable({
  providedIn: 'root'
})
export class UserRoleGuard implements CanActivate {
  private userAuthService = inject(UserAuthService)
  private router = inject(Router)

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const roles = route.data['roles'] as UserRole[]

    return this.userAuthService.isAuthenticated.pipe(
      take(1),
      map((logged) => {
        const includes = logged.role
          ? roles.includes(logged.role)
          : false

        if(includes) {
          return true
        } else {
          return this.router.createUrlTree(['/'])
        }
      })
    )
  }
}

export const setUserRoleGuardData = (...roles: UserRole[]) => {
  return { roles }
}
