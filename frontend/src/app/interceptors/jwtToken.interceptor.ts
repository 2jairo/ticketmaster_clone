import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { JwtService } from "../services/jwt.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class JwtTokenInterceptor implements HttpInterceptor {
  private jwtService = inject(JwtService)

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.jwtService.getToken();

    const request = req.clone({
      setHeaders: token
        ? { 'Authorization': `Bearer ${token}` }
        : {}
    })

    return next.handle(request)
  }
}
