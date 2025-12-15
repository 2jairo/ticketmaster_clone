import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShoppingCartService } from '../../../services/shoppingCart.service';
import { OrderCard } from '../../order-card/order-card';
import { OrderResponse } from '../../../types/orders';

@Component({
  selector: 'app-orders',
  imports: [OrderCard, RouterLink],
  templateUrl: './orders.html'
})
export class Orders implements OnInit {
  private cartService = inject(ShoppingCartService)
  orders: OrderResponse[] = []

  ngOnInit(): void {
    this.cartService.getOrders().subscribe((o) => {
      this.orders = o
    })
  }
}
