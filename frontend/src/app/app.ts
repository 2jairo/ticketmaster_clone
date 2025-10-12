import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { UserAuthService } from './services/userAuth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html'
})
export class App implements OnInit {
  private userAuthService = inject(UserAuthService)

  ngOnInit(): void {
    this.userAuthService.populate()
  }
}
