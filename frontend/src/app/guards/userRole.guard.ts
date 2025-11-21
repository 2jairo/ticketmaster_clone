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
    const redirectTo = route.data['redirectTo'] as (r: UserRole) => string | undefined

    return this.userAuthService.isAuthenticated.pipe(
      take(1),
      map((logged) => {
        console.log('roles', roles, logged.role)
        const includes = logged.role
          ? roles.includes(logged.role)
          : false

        if(includes) {
          return true
        } else {
          const url = logged.role && redirectTo
            ? redirectTo(logged.role)
            : '/'

          return this.router.createUrlTree([url])
        }
      })
    )
  }
}

export const setUserRoleGuardData = (conf: { roles?: UserRole[], redirectTo?: (r: UserRole) => string }) => {
  conf.roles = conf.roles || []
  return conf
}
