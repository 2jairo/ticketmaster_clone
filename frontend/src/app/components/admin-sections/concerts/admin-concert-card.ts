import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminsService } from '../../../services/admins.service';
import { AdminDashboardConcertResponse, ConcertStatus } from '../../../types/adminDashboard';
import { formatConcertStatus } from '../../../utils/format';
import { AdminConcertDialog } from "./admin-concert-dialog";
import { Carousel } from "../../carousel/carousel";

@Component({
  selector: 'app-admin-concert-card',
  imports: [ReactiveFormsModule, AdminConcertDialog, Carousel],
  styleUrls: ['../common-card.css'],
  templateUrl: './admin-concert-card.html',
})
export class AdminConcertCard {
  private adminsService = inject(AdminsService)

  @Input({ required: true }) concert!: AdminDashboardConcertResponse
  @Output() onUpdatedConcert = new EventEmitter<{ slug: string, newConcert: AdminDashboardConcertResponse }>()
  @Output() onDeletedConcert = new EventEmitter<{ slug: string }>()
  @ViewChild('settings') settingsDialog!: ElementRef<HTMLDetailsElement>

  openDialog!: (e: PointerEvent) => void

  pipeOnUpdated(event: { slug: string, newConcert: AdminDashboardConcertResponse }) {
    this.onUpdatedConcert.emit(event)
  }

  setOpenDialog(event: (e: PointerEvent) => void) {
    this.openDialog = event
  }

  settingsDeleteConcert() {
    this.adminsService.deleteConcert(this.concert.slug).subscribe(() => {
      this.settingsDialog.nativeElement.open = false
      this.onDeletedConcert.emit({ slug: this.concert.slug })
    })
  }

  formatConcertStatus(s: ConcertStatus) {
    return formatConcertStatus(s)
  }
  formatCarouselImages(imgs: string[]) {
    return imgs.map(img => ({
      src: img,
      navigateTo: `/details/${this.concert.slug}`
    }))
  }
}
