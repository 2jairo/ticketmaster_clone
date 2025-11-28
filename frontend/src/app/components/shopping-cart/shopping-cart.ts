import { Component, inject, OnInit, signal } from '@angular/core';
import { ShoppingCartService } from '../../services/shoppingCart.service';
import { ShoppingCartResponse } from '../../types/shoppingCart';
import { TicketCartItem } from './ticket-cart-item';
import { MerchCartItem } from './merch-cart-item';
import { LoadingGif } from '../loading-gif/loading-gif';
import { StripeCardElement } from '@stripe/stripe-js';
import { PaymentsService } from '../../services/payments.service';

@Component({
  selector: 'app-shopping-cart-component',
  imports: [TicketCartItem, MerchCartItem, LoadingGif],
  templateUrl: './shopping-cart.html',
})
export class ShoppingCart implements OnInit {
  private cartService = inject(ShoppingCartService)
  private paymentService = inject(PaymentsService)

  cart = signal<ShoppingCartResponse>({ tickets: [], merch: [] })
  loading = true

  cardElement!: StripeCardElement
  cardMounted = false;

  async ngOnInit() {
    this.cartService.populate().subscribe()
    this.cartService.cart.subscribe({
      next: (cart) => {
        this.cart.set(cart)
        this.loading = false
      }
    })

    this.cardElement = await this.paymentService.createCard()
    this.cardElement.mount('#card-element');
    this.cardMounted = true;
  }

  pay() {
    this.paymentService.pay(this.cardElement).subscribe()
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
