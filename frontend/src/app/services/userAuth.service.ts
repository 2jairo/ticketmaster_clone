import { inject, Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { HttpApiService } from './httpApi.service';
import { ChangeCredentialsRequestBody, ChangePasswordRequestBody, JwtClaims, LoginRequestBody, LoginSigninResponse, SigninRequestBody, UserRole } from '../types/userAuth';
import { BehaviorSubject, ReplaySubject, tap } from 'rxjs';
import { ErrKind, LocalErrorResponse } from '../types/error';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private jwtService = inject(JwtService)
  private httpService = inject(HttpApiService)

  private userSubject = new BehaviorSubject<LoginSigninResponse | null>(null)
  readonly user = this.userSubject.asObservable()

  private isAuthenticatedSubject = new ReplaySubject<{ authenticated: boolean, role: UserRole | null }>(1);
  readonly isAuthenticated = this.isAuthenticatedSubject.asObservable();

  private setUser(user: LoginSigninResponse) {
    this.userSubject.next(user)
    this.isAuthenticatedSubject.next({ authenticated: true, role: user.role })
  }

  private logoutInner(destroyToken: boolean) {
    return new Promise((r) => {
      this.userSubject.next(null)
      this.isAuthenticatedSubject.next({ authenticated: false, role: null })
      if (destroyToken) {
        this.jwtService.destroyAccessToken()
        this.httpService
          .post<void>(environment.ADMIN_API_URL, '/auth/logout', undefined, { credentials: 'include' })
          .subscribe(() => r(0))
      }
    })
  }

  private getUserRole() {
    const token = this.jwtService.getAccessToken()
    if (!token) {
      return null
    }

    const claimsB64 = token.split('.')[1]

    try {
      const claims = JSON.parse(atob(claimsB64)) as JwtClaims
      return claims.role
    } catch {
      return null
    }
  }

  logout() {
    return this.logoutInner(true)
  }

  populate() {
    const role = this.getUserRole()

    if (!role) {
      this.isAuthenticatedSubject.next({ authenticated: false, role: null })
      this.userSubject.next(null)
      return
    }

    this.httpService.get<LoginSigninResponse>(environment.ADMIN_API_URL, '/auth/user')
      .subscribe({
        next: (resp) => this.setUser(resp),
        error: (e: HttpErrorResponse) => {
          const err = e.error as LocalErrorResponse
          this.logoutInner(err.error === ErrKind.Unauthorized)
        }
      })
  }

  login(body: LoginRequestBody) {
    return this.httpService.post<LoginSigninResponse & { token: string }>(environment.ADMIN_API_URL, '/auth/login', body)
      .pipe(tap((resp) => {
        this.setUser(resp)
        this.jwtService.setAccessToken(resp.token)
      }))
  }

  signin(body: SigninRequestBody) {
    return this.httpService.post<LoginSigninResponse & { token: string }>(environment.ADMIN_API_URL, '/auth/register', body)
      .pipe(tap((resp) => {
        this.setUser(resp)
        this.jwtService.setAccessToken(resp.token)
      }))
  }

  updateCredentials(body: ChangeCredentialsRequestBody) {
    return this.httpService.post<LoginSigninResponse & { token: string }>(environment.ADMIN_API_URL, '/auth/update', body)
      .pipe(tap((resp) => {
        this.setUser(resp)
        this.jwtService.setAccessToken(resp.token)
      }))
  }

  updatePassword(body: ChangePasswordRequestBody) {
    return this.httpService.post<LoginSigninResponse & { token: string }>(environment.ADMIN_API_URL, '/auth/update/password', body)
      .pipe(tap((resp) => {
        this.setUser(resp)
        this.jwtService.setAccessToken(resp.token)
      }))
  }
}
