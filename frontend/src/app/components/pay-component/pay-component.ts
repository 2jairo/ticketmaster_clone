import { Component, inject, OnInit, signal } from '@angular/core';
import { StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';
import { PaymentsService } from '../../services/payments.service';
import { ShoppingCartService } from '../../services/shoppingCart.service';
import { Router } from '@angular/router';
import { LoadingGif } from '../loading-gif/loading-gif';
import { ShowError } from '../auth-form/show-error';
import { ShoppingCartResponse } from '../../types/shoppingCart';

@Component({
  selector: 'app-pay-component',
  imports: [LoadingGif, ShowError],
  templateUrl: './pay-component.html',
})
export class PayComponent implements OnInit {
  private paymentService = inject(PaymentsService)
  private cartService = inject(ShoppingCartService)
  private router = inject(Router)

  cardNumberElement!: StripeCardNumberElement
  cardExpiryElement!: StripeCardExpiryElement
  cardCvcElement!: StripeCardCvcElement

  elementsMounted = false
  processing = false
  paymentSuccess = false

  cart = signal<ShoppingCartResponse>({ tickets: [], merch: [] })

  error = ''
  cardNumberError = ''
  cardExpiryError = ''
  cardCvcError = ''

  async ngOnInit() {
    // Load cart data
    this.cartService.cart.subscribe(cart => {
      this.cart.set(cart)
    })

    // Create Stripe elements
    const elements = await this.paymentService.createCardElements()
    this.cardNumberElement = elements.cardNumber
    this.cardExpiryElement = elements.cardExpiry
    this.cardCvcElement = elements.cardCvc

    // Mount elements
    this.cardNumberElement.mount('#card-number-element')
    this.cardExpiryElement.mount('#card-expiry-element')
    this.cardCvcElement.mount('#card-cvc-element')

    // Setup error listeners
    this.cardNumberElement.on('change', (event) => {
      this.cardNumberError = event.error ? event.error.message : ''
    })
    this.cardExpiryElement.on('change', (event) => {
      this.cardExpiryError = event.error ? event.error.message : ''
    })
    this.cardCvcElement.on('change', (event) => {
      this.cardCvcError = event.error ? event.error.message : ''
    })

    this.elementsMounted = true
  }

  getTicketsTotalPrice() {
    return this.cart().tickets.reduce((sum, item) =>
      sum + (item.item.price * item.quantity), 0
    )
  }

  getMerchTotalPrice() {
    return this.cart().merch.reduce((sum, item) =>
      sum + (item.item.price * item.quantity), 0
    )
  }

  getTotalPrice() {
    return this.getTicketsTotalPrice() + this.getMerchTotalPrice()
  }

  async pay() {
    if (this.processing || !this.elementsMounted) return

    this.processing = true
    this.error = ''
    this.cardNumberError = ''
    this.cardExpiryError = ''
    this.cardCvcError = ''

    this.paymentService.pay(this.cardNumberElement).subscribe({
      next: (result) => {
        if (result.success) {
          this.paymentSuccess = true
          // Clear cart after successful payment
          this.cartService.cleanCartWithoutHttp()

          // Redirect to success page after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/'])
          }, 2000)
        } else {
          this.error = 'Payment failed. Please try again.'
          this.processing = false
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Payment failed. Please try again.'
        this.processing = false
      }
    })
  }
}
