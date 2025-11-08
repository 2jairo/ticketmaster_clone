import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminsService } from '../../../services/admins.service';
import { AdminDashboardUserResponse } from '../../../types/adminDashboard';
import { Pagination } from '../../categories/filters';
import { environment } from '../../../../environments/environment';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { AdminUserCard } from './admin-user-card';

@Component({
  selector: 'app-users',
  imports: [InfiniteScrollDirective, AdminUserCard],
  templateUrl: './users.html',
})
export class Users implements OnInit {
  private adminsService = inject(AdminsService)
  users = signal<AdminDashboardUserResponse[]>([])

  ngOnInit(): void {
    this.loadUsers()
  }

  pagination: Pagination = {
    offset: 0,
    size: environment.ADMIN_DASHBOARD_USERS_PAGE_SIZE
  }

  loading = false
  allLoaded = false
  loadUsers()  {
    if (this.loading || this.allLoaded) return

    this.loading = true
    this.adminsService.getUserList(this.pagination).subscribe({
      next: (newUsers) => {
        if (newUsers.length === 0) {
          this.allLoaded = true
        } else {
          this.users.update((prev) => [...prev, ...newUsers])
          this.pagination.offset += newUsers.length
        }
      },
      complete: () => this.loading = false
    })
  }

  updateUser({ username, newUser }: { username: string, newUser: AdminDashboardUserResponse }) {
    this.users.update(prev => {
      const idx = prev.findIndex(u => u.username === username)
      if (idx === -1) return prev

      const copy = prev.slice()
      copy[idx] = newUser
      return copy
    })
  }

  deleteUser({ username }: { username: string }) {
    this.users.update(prev => {
      const idx = prev.findIndex(u => u.username === username)
      if (idx === -1) return prev

      const copy = prev.slice()
      copy.splice(idx, 1)
      if (this.pagination.offset > 0) this.pagination.offset -= 1

      return copy
    })
  }
}
