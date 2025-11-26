import { Component, inject, OnInit, signal } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Pagination } from '../../categories/filters';
import { AdminsService } from '../../../services/admins.service';
import { environment } from '../../../../environments/environment';
import { DEFAULT_CONCERT_TICKET, AdminDashboardConcertTicketResponse } from '../../../types/concertTickets';
import { AdminConcertTicketCard } from './admin-concert-ticket-card';
import { AdminConcertTicketDialog } from './admin-concert-ticket-dialog';
import { LoadingGif } from "../../loading-gif/loading-gif";

@Component({
  selector: 'app-concert-tickets',
  imports: [InfiniteScrollDirective, AdminConcertTicketCard, AdminConcertTicketDialog, LoadingGif],
  styleUrls: ['../common.css'],
  templateUrl: './concert-tickets.html',
})
export class ConcertTickets implements OnInit {
  private adminsService = inject(AdminsService)
  concertTickets = signal<AdminDashboardConcertTicketResponse[]>([])

  openDialog!: (e: PointerEvent) => void

  ngOnInit(): void {
    this.loadConcertTickets()
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
  loadConcertTickets() {
    if (this.loading || this.allLoaded) return

    this.loading = true
    this.adminsService.getConcertTicketList(this.pagination).subscribe({
      next: (newTickets) => {
        if (newTickets.length === 0) {
          this.allLoaded = true
        } else {
          this.concertTickets.update((prev) => [...prev, ...newTickets])
          this.pagination.offset += newTickets.length
        }
      },
      complete: () => this.loading = false
    })
  }

  updateConcertTicket({ id, newTicket }: { id: string, newTicket: AdminDashboardConcertTicketResponse }) {
    this.concertTickets.update(prev => {
      const idx = prev.findIndex(u => u.id === id)
      if (idx === -1) return prev

      const copy = prev.slice()
      copy[idx] = newTicket
      return copy
    })
  }

  addConcertTicket(newTicket: AdminDashboardConcertTicketResponse) {
    this.concertTickets.update(prev => [newTicket, ...prev])
    this.pagination.offset += 1
  }

  deleteConcertTicket({ id }: { id: string }) {
    this.concertTickets.update(prev => {
      const idx = prev.findIndex(u => u.id === id)
      if (idx === -1) return prev

      const copy = prev.slice()
      copy.splice(idx, 1)
      if (this.pagination.offset > 0) this.pagination.offset -= 1

      return copy
    })
  }

  getDefaultConcertTicket() {
    return structuredClone(DEFAULT_CONCERT_TICKET)
  }

}
