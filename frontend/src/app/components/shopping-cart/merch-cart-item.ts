import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ShoppingCartResponse } from '../../types/shoppingCart';
import { ShoppingCartService } from '../../services/shoppingCart.service';
import { Carousel } from "../carousel/carousel";

@Component({
  selector: 'app-merch-cart-item',
  imports: [Carousel],
  templateUrl: './merch-cart-item.html',
})
export class MerchCartItem {
  private cartService = inject(ShoppingCartService)

  @Input({ required: true }) merchItem!: ShoppingCartResponse['merch'][0]
  @Output() onQuantityChange = new EventEmitter<void>()

  updateQuantity(newQuantity: number) {
    this.cartService.updateCart({
      merch: [{
        itemId: this.merchItem.item.id,
        quantity: newQuantity
      }]
    }).subscribe()
  }

  removeItem() {
    this.cartService.updateCart({
      merch: [{
        itemId: this.merchItem.item.id,
        quantity: 0
      }]
    }).subscribe()
  }

  getSubtotal(): number {
    return this.merchItem.item.price * this.merchItem.quantity
  }
  getCarouselImages() {
    return this.merchItem.item.images.map((img) => {
      return { src: img }
    })
  }
}
