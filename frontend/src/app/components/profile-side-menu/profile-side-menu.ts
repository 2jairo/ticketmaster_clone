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
  private userAuthService = inject(UserAuthService)
  private router = inject(Router)
  private route = inject(ActivatedRoute);

  section = 'account'
  logged = false

  ngOnInit(): void {
    this.userAuthService.isAuthenticated.subscribe((logged) => {
      this.logged = logged
    })

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.route.firstChild;
        if (child) {
          const segments = child.snapshot.url.map((seg) => seg.path);
          this.section = segments.join('/') || 'account';
        }
      })

    // this.route.firstChild?.url.subscribe((seg) => {
    //   this.section = seg.map(s => s.path).join('/')
    //   console.log(this.section)
    // })

    // this.router.events.subscribe(event => {
    //   console.log(event)
    //   // this.section = this.router.url;
    // });
  }
}
