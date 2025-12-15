import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { AdminMerchDialog } from './admin-merch-dialog';
import { MerchDashboardMerchandisingResponse } from '../../../types/merchDashboard';
import { Carousel } from "../../carousel/carousel";
import { formatViews } from '../../../utils/format';
import { MerchandisingService } from '../../../services/merchandising.service';

@Component({
  selector: 'app-admin-merch-card',
  imports: [AdminMerchDialog, Carousel],
  styleUrls: ['../common-card.css'],
  templateUrl: './admin-merch-card.html',
})
export class AdminMerchCard {
  private merchService = inject(MerchandisingService)

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
    this.merchService.deleteMerchanside(this.merch.slug).subscribe(() => {
      this.settingsDialog.nativeElement.open = false
      this.onDeletedMerch.emit({ slug: this.merch.slug })
    })
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
  getStockStatus(merch: MerchDashboardMerchandisingResponse) {
    if(merch.stock === 0) return 'red'
    if(merch.stock < 250) return 'orange'
    return ''
  }
}
