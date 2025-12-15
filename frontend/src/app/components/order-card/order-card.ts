import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OrderResponse } from '../../types/orders';
import { formatOrderStatus, formatPaymentStatus } from '../../utils/format';

@Component({
  selector: 'app-order-card',
  imports: [DatePipe],
  templateUrl: './order-card.html'
})
export class OrderCard {
  @Input({ required: true }) order!: OrderResponse

  formatPaymentStatus(status: 'PENDING' | 'COMPLETED') {
    return formatPaymentStatus(status)
  }

  formatOrderStatus(status: 'CANCELED' | 'FAILED' | 'PAID' | 'PENDING') {
    return formatOrderStatus(status)
  }

  formatCurrency(n: number) {
    return (n / 100).toFixed(2) + '€'
  }
}
