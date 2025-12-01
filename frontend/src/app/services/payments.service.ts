import { inject, Injectable } from '@angular/core';
import { HttpApiService } from './httpApi.service';
import { loadStripe, Stripe, StripeCardElement, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement, StripeElementStyle } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';
import { from, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  private http = inject(HttpApiService)
  private stripe: Stripe | null = null
  private fetchingStripe = false

  private async getStripe() {
    if (!this.stripe) {
      if (this.fetchingStripe) {
        while (this.fetchingStripe) {
          await new Promise(res => setTimeout(res,5));
        }
      } else {
        this.fetchingStripe = true
        this.stripe = await loadStripe(environment.STRIPE_PK)
        this.fetchingStripe = false
      }
    }
    return this.stripe!
  }

  async createCard() {
    const stripe = await this.getStripe()
    const elements = stripe!.elements();
    return elements.create('card');
  }

  async createCardElements() {
    const stripe = await this.getStripe()
    const elements = stripe.elements()

    const style: StripeElementStyle = {
      invalid: {
        color: 'var(--pico-form-element-invalid-border-color)',
        iconColor: 'var(--pico-form-element-invalid-border-color)'
      }
    }

    return {
      cardNumber: elements.create('cardNumber', { style }),
      cardExpiry: elements.create('cardExpiry', { style }),
      cardCvc: elements.create('cardCvc', { style })
    }
  }

  pay(cardElement: StripeCardElement | StripeCardNumberElement) {
    return this.http.post<{ clientSecret: string }>(environment.ADMIN_API_URL, '/payments/create-payment-intent', undefined)
      .pipe(
        switchMap(resp =>
          from(
            this.getStripe().then((stripe) => {
              return stripe.confirmCardPayment(resp.clientSecret, {
                payment_method: { card: cardElement }
              });
            })
          )
        ),
        map((result) => ({ success: result.paymentIntent?.status === 'succeeded' }))
      )
  }
}
