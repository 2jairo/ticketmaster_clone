import { Component, inject, OnInit, signal } from '@angular/core';
import { UserAuthService } from '../../services/userAuth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DEFAULT_USER_ROUTE_SECTION } from '../../pages/user/user.routes';
import { AsyncPipe } from '@angular/common';
import { UserSectionsSideMenuInner } from "./user-sections-side-menu-inner";


@Component({
  selector: 'app-user-sections-side-menu',
  imports: [AsyncPipe, UserSectionsSideMenuInner],
  templateUrl: './user-sections-side-menu.html'
})
export class UserSectionsSideMenu implements OnInit {
  readonly userAuthService = inject(UserAuthService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  sectionAll = signal('')
  section = signal('')

  ngOnInit(): void {
    this.setSectionFromRoute()

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setSectionFromRoute()
      })
  }

  private setSectionFromRoute() {
    const child = this.route.firstChild

    if (child && child.snapshot.url.length > 0) {
      const segment = child.snapshot.url.map(p => p.path)

      this.sectionAll.set(segment.join('/'))
      this.section.set(segment[0])
    } else {
      this.sectionAll.set(DEFAULT_USER_ROUTE_SECTION)
      this.section.set(DEFAULT_USER_ROUTE_SECTION)
    }
  }
}
