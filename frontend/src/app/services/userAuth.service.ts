import { inject, Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { HttpApiService } from './httpApi.service';
import { ChangeCredentialsRequestBody, LoginRequestBody, LoginSigninResponse, SigninRequestBody } from '../types/userAuth';
import { BehaviorSubject, ReplaySubject, tap } from 'rxjs';
import { ErrKind, LocalErrorResponse } from '../types/error';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private jwtService = inject(JwtService)
  private httpService = inject(HttpApiService)

  private userSubject = new BehaviorSubject<LoginSigninResponse | null>(null)
  readonly user = this.userSubject.asObservable()

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  readonly isAuthenticated = this.isAuthenticatedSubject.asObservable();

  private setUser(user: LoginSigninResponse) {
    this.userSubject.next(user)
    this.isAuthenticatedSubject.next(true)
  }

  private logoutInner(destroyToken: boolean) {
    this.userSubject.next(null)
    this.isAuthenticatedSubject.next(false)
    if(destroyToken) {
      this.jwtService.destroyToken()
    }
  }

  logout() {
    this.logoutInner(true)
  }

  populate() {
    if(!this.jwtService.getToken()) {
      this.isAuthenticatedSubject.next(false)
      this.userSubject.next(null)
      return
    }

    this.httpService.get<LoginSigninResponse>(environment.USER_API_URL, '/auth/user')
      .subscribe({
        next: (resp) => this.setUser(resp),
        error: (e: LocalErrorResponse) => {
          this.logoutInner(e.error === ErrKind.Status0)
        }
      })
  }

  login(body: LoginRequestBody) {
    return this.httpService.post<LoginSigninResponse & { token: string }>(environment.USER_API_URL, '/auth/login', body)
      .pipe(tap((resp) => {
        this.setUser(resp)
        this.jwtService.setToken(resp.token)
      }))
  }

  signin(body: SigninRequestBody) {
    return this.httpService.post<LoginSigninResponse & { token: string }>(environment.USER_API_URL, '/auth/signin', body)
      .pipe(tap((resp) => {
        this.setUser(resp)
        this.jwtService.setToken(resp.token)
      }))
  }

  updateCredentials(body: ChangeCredentialsRequestBody) {
    return this.httpService.post<LoginSigninResponse & { token: string }>(environment.USER_API_URL, '/auth/update', body)
      .pipe(tap((resp) => {
        this.setUser(resp)
        this.jwtService.setToken(resp.token)
      }))
  }
}
