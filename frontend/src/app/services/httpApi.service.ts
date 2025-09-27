import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

const BASE_URL = 'http://localhost:3000'

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {
  http = inject(HttpClient)

  get<T>(url: string, options?: Parameters<HttpClient['get']>[1]) {
    return this.http.get<T>(`${BASE_URL}${url}`, options)
  }

  post<T>(url: string, body: any, options?: Parameters<HttpClient['post']>[2]) {
    return this.http.post<T>(`${BASE_URL}${url}`, body, options)
  }

  delete<T>(url: string, options?: Parameters<HttpClient['delete']>[1]) {
    return this.http.delete<T>(`${BASE_URL}${url}`, options)
  }

  update<T>(url: string, body: any, options?: Parameters<HttpClient['put']>[2]) {
    return this.http.put<T>(`${BASE_URL}${url}`, body, options)
  }
}
