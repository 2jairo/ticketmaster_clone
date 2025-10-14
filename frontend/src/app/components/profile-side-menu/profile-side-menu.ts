import { Component, inject, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/userAuth.service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-profile-side-menu',
  imports: [RouterLink],
  templateUrl: './profile-side-menu.html'
})
export class ProfileSideMenu implements OnInit {
  readonly userAuthService = inject(UserAuthService)
  private router = inject(Router)
  private route = inject(ActivatedRoute);

  section = 'account'

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.route.firstChild;
        if (child) {
          const segments = child.snapshot.url.map((seg) => seg.path);
          this.section = segments.join('/') || 'account';
        }
      })
  }
}
