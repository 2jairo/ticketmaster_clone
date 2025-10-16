import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrKind, LocalErrorResponse } from '../types/error';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {
  private http = inject(HttpClient)

  private catchErr = catchError((err: HttpErrorResponse) => {
    return throwError(() => {
      let newError: LocalErrorResponse = {
        error: ErrKind.Status0
      }

      if(err.error && err.error.error in ErrKind) {
        newError = err.error
      }

      return new HttpErrorResponse({
        error: newError,
        headers: err.headers,
        redirected: err.redirected,
        status: err.status,
        statusText: err.statusText,
        url: err.url ? err.url : undefined,
      })
    })
  })

  get<T>(baseUrl: string, url: string, options?: Parameters<HttpClient['get']>[1]) {
    return this.http.get<T>(`${baseUrl}${url}`, options).pipe(this.catchErr) as Observable<T>
  }

  post<T>(baseUrl: string, url: string, body: any, options?: Parameters<HttpClient['post']>[2]) {
    return this.http.post<T>(`${baseUrl}${url}`, body, options).pipe(this.catchErr) as Observable<T>
  }

  delete<T>(baseUrl: string, url: string, options?: Parameters<HttpClient['delete']>[1]) {
    return this.http.delete<T>(`${baseUrl}${url}`, options).pipe(this.catchErr) as Observable<T>
  }

  update<T>(baseUrl: string, url: string, body: any, options?: Parameters<HttpClient['put']>[2]) {
    return this.http.put<T>(`${baseUrl}${url}`, body, options).pipe(this.catchErr) as Observable<T>
  }
}

