import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { AdminDashboardUserResponse } from '../../../types/adminDashboard';
import { UserAvatar } from "../../user-avatar/user-avatar";
import { formatUserRole } from '../../../utils/format';
import { UserRole } from '../../../types/userAuth';
import { AdminsService } from '../../../services/admins.service';
import { AdminUserDialog } from './admin-user-dialog';

@Component({
  selector: 'app-admin-user-card',
  imports: [UserAvatar, AdminUserDialog],
  styleUrls: ['../common-card.css'],
  templateUrl: './admin-user-card.html',
})
export class AdminUserCard {
  private adminsService = inject(AdminsService)

  @Input({ required: true }) user!: AdminDashboardUserResponse
  @Output() onUpdatedUser = new EventEmitter<{ username: string, newUser: AdminDashboardUserResponse }>()
  @Output() onDeletedUser = new EventEmitter<{ username: string }>()
  @ViewChild('settings') settingsDialog!: ElementRef<HTMLDetailsElement>

  openDialog!: (e: PointerEvent) => void

  pipeOnUpdated(event: { username: string, newUser: AdminDashboardUserResponse }) {
    this.onUpdatedUser.emit(event)
  }

  setOpenDialog(event: (e: PointerEvent) => void) {
    this.openDialog = event
  }

  settingsDeleteUser() {
    this.adminsService.deleteUser(this.user.username).subscribe(() => {
      this.settingsDialog.nativeElement.open = false
      this.onDeletedUser.emit({ username: this.user.username })
    })
  }

  formatUserRole(r: UserRole) {
    return formatUserRole(r)
  }
}
