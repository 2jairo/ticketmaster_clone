import { Injectable } from '@angular/core';

const LS_TOKEN_KEY = 'jwt'


@Injectable({
  providedIn: 'root'
})
export class JwtService {
  getToken() {
    return localStorage.getItem(LS_TOKEN_KEY)
  }

  setToken(value: string) {
    localStorage.setItem(LS_TOKEN_KEY, value)
  }

  destroyToken() {
    localStorage.removeItem(LS_TOKEN_KEY)
  }
}
