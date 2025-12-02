import { Component, inject, OnInit } from '@angular/core';
import { MerchandisingService } from '../../services/merchandising.service';
import { MerchDashboardMerchandisingResponse } from '../../types/merchDashboard';
import { tap } from 'rxjs';
import { LoadingGif } from "../loading-gif/loading-gif";
import { environment } from '../../../environments/environment';
import { ShopItemCard } from "../shop-item-card/shop-item-card";
import { ShoppingCartResponse } from '../../types/shoppingCart';
import { ShoppingCartService } from '../../services/shoppingCart.service';

@Component({
  selector: 'app-shop-component',
  imports: [LoadingGif, ShopItemCard],
  templateUrl: './shop-component.html',
})
export class ShopComponent implements OnInit {
  private merchService = inject(MerchandisingService)
  private cartService = inject(ShoppingCartService)

  merchandise: MerchDashboardMerchandisingResponse[] = []

  fetching = true
  currentPage = 1
  pages: number[] = []
  offset = 0

  cartItems: ShoppingCartResponse = { merch: [], tickets: [] }
  localMerch: { itemId: string, quantity: number }[] = []

  ngOnInit(): void {
    this.loadMerchandise()
    this.cartService.cart.subscribe((c) => {
      this.cartItems = c
    })
  }

  loadMerchandise() {
    this.fetching = true

    this.merchService.getMerchandising({ size: environment.CONCERTS_PAGE_SIZE, offset: this.offset })
      .pipe(tap(() => {
        this.fetching = false
      }))
      .subscribe({
        next: (merch) => {
          this.merchandise = merch
          // TODO: Update when API returns totalCount
          this.pages = [1]
          this.currentPage = 1
        },
        error: (e) => {
          //TODO
        }
      })
  }

  getCartMerchItemQuantity(merch: MerchDashboardMerchandisingResponse) {
    const localQuantity = this.localMerch
      .find((t) => t.itemId === merch.id)
      ?.quantity

    if (localQuantity !== undefined) {
      return localQuantity
    }

    return this.cartItems.merch
      .find((t) => t.item.id == merch.id)
      ?.quantity || 0
  }

  updateLocalMerch(item: { itemId: string, quantity: number }) {
    const merchIdx = this.localMerch.findIndex((i) => i.itemId === item.itemId)
    if (merchIdx === -1) {
      this.localMerch.push(item)
    } else {
      this.localMerch[merchIdx] = item
    }
    this.updateCart()
  }

  updateCart() {
    this.cartService.updateCart({ merch: this.localMerch })
      .subscribe(() => {
        this.localMerch = []
      })
  }

  setPage(page: number) {
    if (page < 1 || page > this.pages.length) {
      return
    }

    this.currentPage = page
    this.offset = (page - 1) * environment.CONCERTS_PAGE_SIZE
    this.loadMerchandise()
    window.scrollTo({ top: 0 })
  }
}
