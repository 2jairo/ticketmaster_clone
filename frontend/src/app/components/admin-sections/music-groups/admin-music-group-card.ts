import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AdminsService } from '../../../services/admins.service';
import { AdminDashboardMusicGroupResponse, MusicGroupStatus } from '../../../types/musicGroupts';
import { formatMusicGroupStatus } from '../../../utils/format';
import { AdminMusicGroupDialog } from "./admin-music-group-dialog";

@Component({
  selector: 'app-admin-music-group-card',
  imports: [ReactiveFormsModule, AdminMusicGroupDialog],
  styleUrls: ['../common-card.css'],
  templateUrl: './admin-music-group-card.html',
})
export class AdminMusicGroupCard {
  private adminsService = inject(AdminsService)

  @Input({ required: true }) group!: AdminDashboardMusicGroupResponse
  @Output() onUpdatedGroup = new EventEmitter<{ slug: string, newGroup: AdminDashboardMusicGroupResponse }>()
  @Output() onDeletedGroup = new EventEmitter<{ slug: string }>()
  @ViewChild('settings') settingsDialog!: ElementRef<HTMLDetailsElement>

  openDialog!: (e: PointerEvent) => void

  pipeOnUpdated(event: { slug: string, newGroup: AdminDashboardMusicGroupResponse }) {
    this.onUpdatedGroup.emit(event)
  }

  setOpenDialog(event: (e: PointerEvent) => void) {
    this.openDialog = event
  }

  settingsDeleteGroup() {
    this.adminsService.deleteMusicGroup(this.group.slug).subscribe(() => {
      this.settingsDialog.nativeElement.open = false
      this.onDeletedGroup.emit({ slug: this.group.slug })
    })
  }

  formatMusicGroupStatus(s: MusicGroupStatus) {
    return formatMusicGroupStatus(s)
  }
}
