import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MerchandisingService } from '../../../services/merchandising.service';
import { MerchDashboardMerchCategoryResponse } from '../../../types/merchDashboard';
import { AdminMerchCategoryDialog } from './admin-merch-category-dialog';

@Component({
  selector: 'app-admin-merch-category-card',
  imports: [ReactiveFormsModule, AdminMerchCategoryDialog],
  styleUrls: ['../common-card.css'],
  templateUrl: './admin-merch-category-card.html',
})
export class AdminMerchCategoryCard {
  private merchandisingService = inject(MerchandisingService)

  @Input({ required: true }) merchCategory!: MerchDashboardMerchCategoryResponse
  @Output() onUpdatedMerchCategory = new EventEmitter<{ slug: string, newMerchCategory: MerchDashboardMerchCategoryResponse }>()
  @Output() onDeletedMerchCategory = new EventEmitter<{ slug: string }>()
  @ViewChild('settings') settingsDialog!: ElementRef<HTMLDetailsElement>

  openDialog!: (e: PointerEvent) => void

  pipeOnUpdated(event: { slug: string, newMerchCategory: MerchDashboardMerchCategoryResponse }) {
    this.onUpdatedMerchCategory.emit(event)
  }

  setOpenDialog(event: (e: PointerEvent) => void) {
    this.openDialog = event
  }

  settingsDeleteMerchCategory() {
    this.merchandisingService.deleteMerchCategory(this.merchCategory.slug).subscribe(() => {
      this.settingsDialog.nativeElement.open = false
      this.onDeletedMerchCategory.emit({ slug: this.merchCategory.slug })
    })
  }
}
