import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AdminMerchDialog } from './admin-merch-dialog';
import { MerchDashboardMerchandisingResponse } from '../../../types/merchDashboard';
import { Carousel } from "../../carousel/carousel";
import { formatViews } from '../../../utils/format';

@Component({
  selector: 'app-admin-merch-card',
  imports: [AdminMerchDialog, Carousel],
  templateUrl: './admin-merch-card.html',
})
export class AdminMerchCard {
  @Input({ required: true }) merch!: MerchDashboardMerchandisingResponse
  @Output() onUpdatedMerch = new EventEmitter<{ slug: string, newMerch: MerchDashboardMerchandisingResponse }>()
  @Output() onDeletedMerch = new EventEmitter<{ slug: string }>()
  @ViewChild('settings') settingsDialog!: ElementRef<HTMLDetailsElement>

  openDialog!: (e: PointerEvent) => void

  setOpenDialog(event: (e: PointerEvent) => void) {
    this.openDialog = event
  }

  pipeOnUpdated(event: { slug: string, newMerch: MerchDashboardMerchandisingResponse }) {
    this.onUpdatedMerch.emit(event)
  }

  settingsDeleteMerch() {
    this.settingsDialog.nativeElement.open = false
    this.onDeletedMerch.emit({ slug: this.merch.slug })
  }

  formatCarouselImages(imgs: string[]) {
    return imgs.map(img => ({
      src: img,
      //navigateTo: `/events?category=${this.merch.slug}` //TODO
    }))
  }

  formatQuantity(n: number) {
    return formatViews(n)
  }
  isStockDangerous(merch: MerchDashboardMerchandisingResponse) {
    return merch.stock > 0 && merch.sold / merch.stock >= 0.8
  }
}
