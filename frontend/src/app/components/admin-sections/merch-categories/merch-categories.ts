import { Component, inject, OnInit, signal } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MerchandisingService } from '../../../services/merchandising.service';
import { DEFAULT_MERCH_CATEGORY, MerchDashboardMerchCategoryResponse } from '../../../types/merchDashboard';
import { AdminMerchCategoryCard } from './admin-merch-category-card';
import { AdminMerchCategoryDialog } from './admin-merch-category-dialog';
import { LoadingGif } from "../../loading-gif/loading-gif";

@Component({
  selector: 'app-merch-categories',
  imports: [InfiniteScrollDirective, AdminMerchCategoryCard, AdminMerchCategoryDialog, LoadingGif],
  styleUrls: ['../common.css'],
  templateUrl: './merch-categories.html',
})
export class MerchCategories implements OnInit {
  private merchandisingService = inject(MerchandisingService)
  merchCategories = signal<MerchDashboardMerchCategoryResponse[]>([])

  openDialog!: (e: PointerEvent) => void

  ngOnInit(): void {
    this.loadMerchCategories()
  }

  setOpenDialog(event: (e: PointerEvent) => void) {
    this.openDialog = event
  }

  loading = false
  allLoaded = false
  loadMerchCategories() {
    if (this.loading || this.allLoaded) return

    this.loading = true
    this.merchandisingService.getMerchCategories().subscribe({
      next: (categories) => {
        this.merchCategories.set(categories)
        this.allLoaded = true
      },
      complete: () => this.loading = false
    })
  }

  updateMerchCategory({ slug, newMerchCategory }: { slug: string, newMerchCategory: MerchDashboardMerchCategoryResponse }) {
    this.merchCategories.update(prev => {
      const idx = prev.findIndex(u => u.slug === slug)
      if (idx === -1) return prev

      const copy = prev.slice()
      copy[idx] = newMerchCategory
      return copy
    })
  }

  addMerchCategory(newMerchCategory: MerchDashboardMerchCategoryResponse) {
    this.merchCategories.update(prev => [newMerchCategory, ...prev])
  }

  deleteMerchCategory({ slug }: { slug: string }) {
    this.merchCategories.update(prev => {
      const idx = prev.findIndex(u => u.slug === slug)
      if (idx === -1) return prev

      const copy = prev.slice()
      copy.splice(idx, 1)
      return copy
    })
  }

  getDefaultMerchCategory() {
    return structuredClone(DEFAULT_MERCH_CATEGORY)
  }

}
