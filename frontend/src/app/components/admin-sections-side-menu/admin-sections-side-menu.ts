import { Component, inject } from '@angular/core';
import { DEFAULT_ADMIN_ROUTE_SECTION } from '../../pages/admin/admin.routes';
import { SideMenuSections } from '../../utils/side-menu';
import { RouterLink } from '@angular/router';
import { UserAuthService } from '../../services/userAuth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-admin-sections-side-menu',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './admin-sections-side-menu.html',
})
export class AdminSectionsSideMenu {
  readonly userAuthService = inject(UserAuthService)
  readonly sideMenuSections = new SideMenuSections(DEFAULT_ADMIN_ROUTE_SECTION)

  ngOnInit(): void {
    this.sideMenuSections.init()
  }
}
