import { Component, inject, Input } from '@angular/core';
import { ShoppingCartResponse } from '../../types/shoppingCart';
import { ShoppingCartService } from '../../services/shoppingCart.service';
import { RouterLink } from '@angular/router';
import { formatViews } from '../../utils/format';
import { Carousel } from "../carousel/carousel";

@Component({
  selector: 'app-ticket-cart-item',
  imports: [RouterLink, Carousel],
  templateUrl: './ticket-cart-item.html',
})
export class TicketCartItem {
  private cartService = inject(ShoppingCartService)

  @Input({ required: true }) ticketItem!: ShoppingCartResponse['tickets'][0]

  updateQuantity(newQuantity: number) {
    this.cartService.updateCart({
      tickets: [{
        itemId: this.ticketItem.item.id,
        quantity: newQuantity
      }]
    }).subscribe()
  }

  removeItem() {
    this.cartService.updateCart({
      tickets: [{
        itemId: this.ticketItem.item.id,
        quantity: 0
      }]
    }).subscribe()
  }

  getSubtotal(): number {
    return this.ticketItem.item.price * this.ticketItem.quantity
  }
  formatQty(n: number) {
    return formatViews(n)
  }
  getCarouselImages() {
    return this.ticketItem.item.concertImages.map((img) => {
      return { src: img }
    })
  }
}
