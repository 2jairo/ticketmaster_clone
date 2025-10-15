import { Component, inject, OnInit, signal } from '@angular/core';
import { UserAuthService } from '../../services/userAuth.service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { DEFAULT_USER_ROUTE_SECTION } from '../../pages/user/user.routes';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-user-sections-side-menu',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './user-sections-side-menu.html'
})
export class UserSectionsSideMenu implements OnInit {
  readonly userAuthService = inject(UserAuthService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

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

    if (child) {
      const segment = child.snapshot.url.length > 0
        ? child.snapshot.url[0].path
        : DEFAULT_USER_ROUTE_SECTION

      this.section.set(segment)
    } else {
      this.section.set(DEFAULT_USER_ROUTE_SECTION)
    }
  }
}
