import { Component, inject, OnInit } from '@angular/core';
import { AdminsService } from '../../../services/admins.service';
import { AdminDashboardUserResponse } from '../../../types/adminDashboard';
import { Pagination } from '../../categories/filters';
import { environment } from '../../../../environments/environment';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-users',
  imports: [InfiniteScrollDirective],
  templateUrl: './users.html',
})
export class Users implements OnInit {
  private adminsService = inject(AdminsService)
  users: AdminDashboardUserResponse[] = []

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
          this.users = [...this.users, ...newUsers]
          this.pagination.offset += newUsers.length
        }
      },
      complete: () => this.loading = false
    })
  }
}
