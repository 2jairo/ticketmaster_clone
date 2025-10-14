import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserAuthService } from '../../services/userAuth.service';
import { LoginSigninResponse } from '../../types/userAuth';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html'
})
export class Header implements OnInit {
  private userAuthService = inject(UserAuthService)

  user: LoginSigninResponse | null = null

  ngOnInit(): void {
    this.userAuthService.user.subscribe((user) => {
      this.user = user
    })
    this.userAuthService.populate()
  }
}
