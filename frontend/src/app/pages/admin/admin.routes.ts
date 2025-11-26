import { Route } from "@angular/router";
import { UserRoleGuard, setUserRoleGuardData } from "../../guards/userRole.guard";

export const DEFAULT_ADMIN_ROUTE_SECTION = 'concerts'

export const ADMIN_ROUTES: Route[] = [
  {
    path: 'concerts',
    loadComponent: () => import('../../components/admin-sections/concerts/concerts').then(c => c.Concerts),
    canActivate: [UserRoleGuard],
    data: setUserRoleGuardData({ roles: ['ROOT', 'ADMIN', 'ENTERPRISE'] })
  },
  {
    path: 'concert-categories',
    loadComponent: () => import('../../components/admin-sections/categories/categories').then(c => c.Categories),
    canActivate: [UserRoleGuard],
    data: setUserRoleGuardData({ roles: ['ROOT', 'ADMIN'] })
  },
  {
    path: 'music-groups',
    loadComponent: () => import('../../components/admin-sections/music-groups/music-groups').then(c => c.MusicGroups),
    canActivate: [UserRoleGuard],
    data: setUserRoleGuardData({ roles: ['ROOT', 'ADMIN'] })
  },
  {
    path: 'tickets',
    loadComponent: () => import('../../components/admin-sections/concert-tickets/concert-tickets').then(c => c.ConcertTickets),
    canActivate: [UserRoleGuard],
    data: setUserRoleGuardData({ roles: ['ROOT', 'ADMIN'] })
  },
  {
    path: 'users',
    loadComponent: () => import('../../components/admin-sections/users/users').then(c => c.Users),
    canActivate: [UserRoleGuard],
    data: setUserRoleGuardData({ roles: ['ROOT'] })
  },
  {
    path: 'merchandising',
    loadComponent: () => import('../../components/admin-sections/merchandising/merchandising').then(c => c.Merchandising),
    canActivate: [UserRoleGuard],
    data: setUserRoleGuardData({ roles: ['ROOT', 'ENTERPRISE'] })
  },
  {
    path: 'merch-categories',
    loadComponent: () => import('../../components/admin-sections/merch-categories/merch-categories').then(c => c.MerchCategories),
    canActivate: [UserRoleGuard],
    data: setUserRoleGuardData({ roles: ['ROOT', 'ENTERPRISE'] })
  },
  {
    path: '**',
    pathMatch: "full",
    redirectTo: DEFAULT_ADMIN_ROUTE_SECTION
  }
]
