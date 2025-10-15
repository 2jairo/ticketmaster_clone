import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { UserAuthService } from '../services/userAuth.service';
import { map, skip, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileRedirectGuard implements CanActivate {
  private router = inject(Router)
  private userAuthService = inject(UserAuthService)

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return this.userAuthService.isAuthenticated.pipe(
      take(1),
      switchMap(() => this.userAuthService.user),
      map((user) => {
        if(!user) {
          return false
        }
        return this.router.createUrlTree([`/user/profile/${user.username}`])
      })
    )
  }
}
