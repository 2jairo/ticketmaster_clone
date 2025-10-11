import { inject, Injectable, OnInit } from '@angular/core';
import { JwtService } from './jwt.service';
import { HttpApiService } from './httpApi.service';
import { LoginRequestBody, LoginSigninResponse, SigninRequestBody } from '../types/userAuth';
import { BehaviorSubject, ReplaySubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private jwtService = inject(JwtService)
  private httpService = inject(HttpApiService)

  private userSubject = new BehaviorSubject<LoginSigninResponse>({} as LoginSigninResponse)
  user = this.userSubject.asObservable()

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  isAuthenticated = this.isAuthenticatedSubject.asObservable();

  private setUser(user: LoginSigninResponse) {
    this.userSubject.next(user)
    this.isAuthenticatedSubject.next(true)
  }

  logout() {
    this.userSubject.next({} as LoginSigninResponse)
    this.isAuthenticatedSubject.next(false)
    this.jwtService.destroyToken()
  }

  populate() {
    return this.httpService.get<LoginSigninResponse>('/auth/user')
      .pipe(tap((resp) => {
        this.setUser(resp)
      }))
  }

  login(body: LoginRequestBody) {
    return this.httpService.post<LoginSigninResponse & { token: string }>('/auth/login', body)
      .pipe(tap((resp) => {
        this.setUser(resp)
        this.jwtService.setToken(resp.token)
      }))
  }

  signin(body: SigninRequestBody) {
    return this.httpService.post<LoginSigninResponse & { token: string }>('/auth/signin', body)
      .pipe(tap((resp) => {
        this.setUser(resp)
        this.jwtService.setToken(resp.token)
      }))
  }
}
