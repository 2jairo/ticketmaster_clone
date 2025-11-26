import { inject, Injectable } from '@angular/core';
import { HttpApiService } from './httpApi.service';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ShoppingCartResponse, UpdateShoppingCartBody } from '../types/shoppingCart';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private http = inject(HttpApiService)

  private cartSubject = new BehaviorSubject<ShoppingCartResponse>({
    tickets: [], merch: []
  })
  readonly cart = this.cartSubject.asObservable()

  populate() {
    return this.http.get<ShoppingCartResponse>(environment.USER_API_URL, '/cart')
      .pipe(tap((resp) => {
        this.cartSubject.next(resp)
      }))
  }

  updateCart(body: UpdateShoppingCartBody) {
    return this.http.update<ShoppingCartResponse>(environment.USER_API_URL, '/cart', body)
      .pipe(tap((resp) => {
        this.cartSubject.next(resp)
      }))
  }

  clearCart() {
    return this.http.post(environment.USER_API_URL, '/cart/clear', undefined)
      .pipe(tap((resp) => {
        this.cartSubject.next({ merch: [], tickets: [] })
      }))
  }
}
