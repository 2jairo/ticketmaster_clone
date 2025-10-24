import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, finalize, take, tap } from 'rxjs';
import { HttpApiService } from './httpApi.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

const LS_TOKEN_KEY = 'jwt'


@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private isRefreshing = false
  private refreshTokenSubject = new BehaviorSubject<{ token: string } | null>(null);
  private httpApiService = inject(HttpApiService)
  private router = inject(Router)

  refreshAccessToken() {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.asObservable().pipe(
        take(1)
      )
    }

    this.isRefreshing = true;

    return this.httpApiService.post<{ token: string }>(
      environment.USER_API_URL,
      '/auth/refresh',
      undefined,
      { withCredentials: true }
    ).pipe(
      tap((t) => {
        this.setAccessToken(t.token)
        this.refreshTokenSubject.next(t)
      }),
      finalize(() => this.isRefreshing = false)
    )
  }

  getAccessToken() {
    return localStorage.getItem(LS_TOKEN_KEY)
  }

  setAccessToken(value: string) {
    localStorage.setItem(LS_TOKEN_KEY, value)
  }

  destroyAccessToken() {
    localStorage.removeItem(LS_TOKEN_KEY)
  }

  checkIfLogged() {
    if(!this.getAccessToken()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } })
      return true
    }
    return false
  }
}
