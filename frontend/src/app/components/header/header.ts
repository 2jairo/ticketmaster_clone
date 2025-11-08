import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserAuthService } from '../../services/userAuth.service';
import { AsyncPipe } from '@angular/common';
import { UserAvatar } from "../user-avatar/user-avatar";

@Component({
  selector: 'app-header',
  imports: [RouterLink, AsyncPipe, UserAvatar],
  templateUrl: './header.html'
})
export class Header implements OnInit {
  readonly userAuthService = inject(UserAuthService)

  ngOnInit(): void {
    this.userAuthService.populate()
  }
}
