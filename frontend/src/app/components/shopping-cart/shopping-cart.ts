import { Component, inject, OnInit, signal } from '@angular/core';
import { ShoppingCartService } from '../../services/shoppingCart.service';
import { ShoppingCartResponse } from '../../types/shoppingCart';
import { TicketCartItem } from './ticket-cart-item';
import { MerchCartItem } from './merch-cart-item';
import { LoadingGif } from '../loading-gif/loading-gif';

@Component({
  selector: 'app-shopping-cart-component',
  imports: [TicketCartItem, MerchCartItem, LoadingGif],
  templateUrl: './shopping-cart.html',
})
export class ShoppingCart implements OnInit {
  private cartService = inject(ShoppingCartService)

  cart = signal<ShoppingCartResponse>({ tickets: [], merch: [] })
  loading = true

  ngOnInit(): void {
    this.cartService.populate().subscribe()
    this.cartService.cart.subscribe({
      next: (cart) => {
        this.cart.set(cart)
        this.loading = false
      }
    })
  }

  getTotalPrice(): number {
    const ticketsTotal = this.cart().tickets.reduce((sum, item) =>
      sum + (item.item.price * item.quantity), 0
    )
    const merchTotal = this.cart().merch.reduce((sum, item) =>
      sum + (item.item.price * item.quantity), 0
    )
    return ticketsTotal + merchTotal
  }

  getItemCount(): number {
    return this.cart().tickets.length + this.cart().merch.length
  }

  clearCart() {
    this.cartService.clearCart().subscribe()
  }
}
