import { Component, inject, OnInit, signal } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Pagination } from '../../categories/filters';
import { AdminsService } from '../../../services/admins.service';
import { environment } from '../../../../environments/environment';
import { AdminDashboardConcertResponse, DEFAULT_CONCERT } from '../../../types/adminDashboard';
import { AdminConcertCard } from './admin-concert-card';
import { AdminConcertDialog } from './admin-concert-dialog';
import { LoadingGif } from "../../loading-gif/loading-gif";

@Component({
  selector: 'app-concerts',
  imports: [InfiniteScrollDirective, AdminConcertCard, AdminConcertDialog, LoadingGif],
  styleUrls: ['../common.css'],
  templateUrl: './concerts.html',
})
export class Concerts implements OnInit {
  private adminsService = inject(AdminsService)
  concerts = signal<AdminDashboardConcertResponse[]>([])

  openDialog!: (e: PointerEvent) => void

  ngOnInit(): void {
    this.loadConcerts()
  }

  setOpenDialog(event: (e: PointerEvent) => void) {
    this.openDialog = event
  }

  pagination: Pagination = {
    offset: 0,
    size: environment.ADMIN_DASHBOARD_MUSIC_GROUPS_PAGE_SIZE
  }

  loading = false
  allLoaded = false
  loadConcerts() {
    if (this.loading || this.allLoaded) return

    this.loading = true
    this.adminsService.getConcertList(this.pagination).subscribe({
      next: (newConcerts) => {
        if (newConcerts.length === 0) {
          this.allLoaded = true
        } else {
          this.concerts.update((prev) => [...prev, ...newConcerts])
          this.pagination.offset += newConcerts.length
        }
      },
      complete: () => this.loading = false
    })
  }

  updateConcert({ slug, newConcert }: { slug: string, newConcert: AdminDashboardConcertResponse }) {
    this.concerts.update(prev => {
      const idx = prev.findIndex(u => u.slug === slug)
      if (idx === -1) return prev

      const copy = prev.slice()
      copy[idx] = newConcert
      return copy
    })
  }

  addConcert(newConcert: AdminDashboardConcertResponse) {
    this.concerts.update(prev => [newConcert, ...prev])
    this.pagination.offset += 1
  }

  deleteConcert({ slug }: { slug: string }) {
    this.concerts.update(prev => {
      const idx = prev.findIndex(u => u.slug === slug)
      if (idx === -1) return prev

      const copy = prev.slice()
      copy.splice(idx, 1)
      if (this.pagination.offset > 0) this.pagination.offset -= 1

      return copy
    })
  }

  getDefaultConcert() {
    return structuredClone(DEFAULT_CONCERT)
  }
}
