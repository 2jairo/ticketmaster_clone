import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserAuthService } from '../../services/userAuth.service';
import { AsyncPipe } from '@angular/common';
import { UserAvatar } from "../user-avatar/user-avatar";
import { take } from 'rxjs';
import { ShoppingCartService } from '../../services/shoppingCart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AsyncPipe, UserAvatar],
  templateUrl: './header.html'
})
export class Header implements OnInit {
  readonly userAuthService = inject(UserAuthService)
  readonly cartService = inject(ShoppingCartService)

  ngOnInit(): void {
    if(window.location.pathname !== '/cart') {
      this.userAuthService.isAuthenticated
        .pipe(take(1))
        .subscribe((a) => {
          if(a.authenticated) {
            this.cartService.populate().subscribe()
          }
        })
    }

    this.userAuthService.populate()
  }

  formatCartQty(n: number) {
    return n > 99
      ? `+99`
      : `${n}`
  }
}
