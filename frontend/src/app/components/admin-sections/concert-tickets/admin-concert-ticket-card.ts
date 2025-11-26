import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { AdminConcertTicketDialog } from './admin-concert-ticket-dialog';
import { AdminDashboardConcertTicketResponse } from '../../../types/concertTickets';
import { formatViews } from '../../../utils/format';
import { AdminsService } from '../../../services/admins.service';

@Component({
  selector: 'app-admin-concert-ticket-card',
  imports: [AdminConcertTicketDialog],
  styleUrls: ['../common-card.css'],
  templateUrl: './admin-concert-ticket-card.html',
})
export class AdminConcertTicketCard {
  private adminsService = inject(AdminsService)

  @Input({ required: true }) ticket!: AdminDashboardConcertTicketResponse
  @Output() onUpdatedTicket = new EventEmitter<{ id: string, newTicket: AdminDashboardConcertTicketResponse }>()
  @Output() onDeletedTicket = new EventEmitter<{ id: string }>()
  @ViewChild('settings') settingsDialog!: ElementRef<HTMLDetailsElement>

  openDialog!: (e: PointerEvent) => void

  setOpenDialog(event: (e: PointerEvent) => void) {
    this.openDialog = event
  }

  pipeOnUpdated(event: { id: string, newTicket: AdminDashboardConcertTicketResponse }) {
    this.onUpdatedTicket.emit(event)
  }

  settingsDeleteTicket() {
    this.adminsService.deleteConcertTicket(this.ticket.id).subscribe(() => {
      this.settingsDialog.nativeElement.open = false
      this.onDeletedTicket.emit({ id: this.ticket.id })
    })
  }

  formatQuantity(n: number) {
    return formatViews(n)
  }

  getAvailableStatus(ticket: AdminDashboardConcertTicketResponse) {
    if(ticket.available === 0) return 'red'
    if(ticket.available < 100) return 'orange'
    return ''
  }
}
