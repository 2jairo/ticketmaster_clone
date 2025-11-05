import { Component, inject, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/userAuth.service';
import { DEFAULT_USER_ROUTE_SECTION } from '../../pages/user/user.routes';
import { AsyncPipe } from '@angular/common';
import { UserSectionsSideMenuInner } from "./user-sections-side-menu-inner";
import { SideMenuSections } from '../../utils/side-menu';


@Component({
  selector: 'app-user-sections-side-menu',
  imports: [AsyncPipe, UserSectionsSideMenuInner],
  templateUrl: './user-sections-side-menu.html'
})
export class UserSectionsSideMenu implements OnInit {
  readonly userAuthService = inject(UserAuthService)
  readonly sideMenuSections = new SideMenuSections(DEFAULT_USER_ROUTE_SECTION)

  ngOnInit(): void {
    this.sideMenuSections.init()
  }
}
