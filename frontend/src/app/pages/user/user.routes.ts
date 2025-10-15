import { Route } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { UserProfileRedirectGuard } from '../../guards/userProfileRedirect.guard';

export const DEFAULT_USER_ROUTE_SECTION = 'profile'

export const USER_ROUTES: Route[] = [
  {
    path: 'account',
    loadComponent: () => import('../../components/user-sections/account/account').then(c => c.Account),
    canActivate: [AuthGuard],
  },
  {
    path: 'orders',
    loadComponent: () => import('../../components/user-sections/orders/orders').then(c => c.Orders),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('../../components/user-sections/profile/profile').then(c => c.Profile),
    canActivate: [UserProfileRedirectGuard] // redirects to /profile/:username when userAuthService.user.username is not null
  },
  {
    path: 'profile/:username',
    loadComponent: () => import('../../components/user-sections/profile/profile').then(c => c.Profile),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: DEFAULT_USER_ROUTE_SECTION
  },
]
