import { Component, inject, Input } from '@angular/core';
import { UserAuthService } from '../../services/userAuth.service';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-user-sections-side-menu-inner',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './user-sections-side-menu-inner.html'
})
export class UserSectionsSideMenuInner {
  readonly userAuthService = inject(UserAuthService)

  @Input({ required: true }) section!: string
}
