import { Component, inject, OnInit, signal } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Pagination } from '../../categories/filters';
import { MerchandisingService } from '../../../services/merchandising.service';
import { environment } from '../../../../environments/environment';
import { DEFAULT_MERCH, MerchDashboardMerchandisingResponse } from '../../../types/merchDashboard';
import { AdminMerchCard } from './admin-merch-card';
import { AdminMerchDialog } from './admin-merch-dialog';
import { LoadingGif } from "../../loading-gif/loading-gif";
import { ShopFilters } from '../../../types/filters';

@Component({
  selector: 'app-merchandising',
  imports: [InfiniteScrollDirective, AdminMerchCard, AdminMerchDialog, LoadingGif],
  styleUrls: ['../common.css'],
  templateUrl: './merchandising.html',
})
export class Merchandising implements OnInit {
  private merchService = inject(MerchandisingService)
  merch = signal<MerchDashboardMerchandisingResponse[]>([])

  openDialog!: (e: PointerEvent) => void

  ngOnInit(): void {
    this.loadMerchandising()
  }

  setOpenDialog(event: (e: PointerEvent) => void) {
    this.openDialog = event
  }

  pagination: Pagination = {
    offset: 0,
    size: environment.ENTERPRISE_DASHBOARD_MERCH_PAGE_SIZE
  }

  loading = false
  allLoaded = false
  loadMerchandising() {
    if (this.loading || this.allLoaded) return

    this.loading = true
    this.merchService.getMerchandising(new ShopFilters(), this.pagination).subscribe({
      next: (newMerch) => {
        if (newMerch.length === 0) {
          this.allLoaded = true
        } else {
          this.merch.update((prev) => [...prev, ...newMerch])
          this.pagination.offset += newMerch.length
        }
      },
      complete: () => this.loading = false
    })
  }

  updateMerch({ slug, newMerch }: { slug: string, newMerch: MerchDashboardMerchandisingResponse }) {
    this.merch.update(prev => {
      const idx = prev.findIndex(u => u.slug === slug)
      if (idx === -1) return prev

      const copy = prev.slice()
      copy[idx] = newMerch
      return copy
    })
  }

  addMerch(newMerch: MerchDashboardMerchandisingResponse) {
    this.merch.update(prev => [newMerch, ...prev])
    this.pagination.offset += 1
  }

  deleteMerch({ slug }: { slug: string }) {
    this.merch.update(prev => {
      const idx = prev.findIndex(u => u.slug === slug)
      if (idx === -1) return prev

      const copy = prev.slice()
      copy.splice(idx, 1)
      if (this.pagination.offset > 0) this.pagination.offset -= 1

      return copy
    })
  }

  getDefaultMerch() {
    return structuredClone(DEFAULT_MERCH)
  }

}
