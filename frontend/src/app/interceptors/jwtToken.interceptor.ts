import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { JwtService } from "../services/jwt.service";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { UserAuthService } from "../services/userAuth.service";
import { HttpApiService } from "../services/httpApi.service";
import { ErrKind, LocalErrorResponse } from "../types/error";


@Injectable({
  providedIn: 'root'
})
export class JwtTokenInterceptor implements HttpInterceptor {
  private jwtService = inject(JwtService)
  private userAuthService = inject(UserAuthService)
  private httpApiService = inject(HttpApiService)

  cloneRequest(req: HttpRequest<any>) {
    const token = this.jwtService.getAccessToken();

    return req.clone({
      setHeaders: token
        ? { 'Authorization': `Bearer ${token}` }
        : {}
    })
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = this.cloneRequest(req)

    return next.handle(request).pipe(
      this.httpApiService.catchErr as (s: Observable<HttpEvent<any>>) => Observable<HttpEvent<any>>,
      catchError((e: HttpErrorResponse) => {
        const err = e.error as LocalErrorResponse
        if(err.error === ErrKind.ExpiredAccessToken) {

          return this.jwtService.refreshAccessToken()
            .pipe(
              switchMap(() => {
                const requestAgain = this.cloneRequest(req)
                return next.handle(requestAgain)
              }),
              catchError((error2) => {
                this.userAuthService.logout()
                // .then(() => {
                //   this.router.navigate(['/auth/login'])
                // })

                return throwError(() => error2)
              })
            )
        }

        return throwError(() => e)
      })
    )
  }
}
