import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { MerchDashboardMerchandisingResponse } from '../../types/merchDashboard';
import { Carousel } from "../carousel/carousel";
import { formatViews } from '../../utils/format';

@Component({
  selector: 'app-shop-item-card',
  imports: [Carousel],
  templateUrl: './shop-item-card.html',
})
export class ShopItemCard implements AfterViewInit {
  @Input({ required: true }) merch!: MerchDashboardMerchandisingResponse
  @Input({ required: true }) quantity!: number
  @Output() onUpdateQuantity = new EventEmitter<{ itemId: string, quantity: number }>()
  @ViewChild('desc') desc!: ElementRef<HTMLDetailsElement>
  private cdr = inject(ChangeDetectorRef);

  hideDesc = false

  ngAfterViewInit(): void {
    if(this.desc.nativeElement) {
      this.hideDesc = this.desc.nativeElement.offsetHeight > 100
      this.cdr.detectChanges()
    }
  }

  toggleHideDesc() {
    this.hideDesc = !this.hideDesc
  }

  updateQuantity(newQuantity: number) {
    this.onUpdateQuantity.emit({ itemId: this.merch.id, quantity: Number(newQuantity) })
  }

  formatCarouselImages(imgs: string[]) {
    return imgs.map((img) => ({ src: img }))
  }

  formatViews(n: number) {
    return formatViews(n)
  }
}
