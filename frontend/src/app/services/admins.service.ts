import { inject, Injectable } from '@angular/core';
import { HttpApiService } from './httpApi.service';
import { environment } from '../../environments/environment';
import { AdminDashboardUpdateUserBody, AdminDashboardUserResponse } from '../types/adminDashboard';
import { Pagination } from '../types/filters';


@Injectable({
  providedIn: 'root'
})
export class AdminsService {
  private http = inject(HttpApiService)

  getUserList(pagination: Pagination) {
    const params = { ...pagination }
    return this.http.get<AdminDashboardUserResponse[]>(environment.ADMIN_API_URL, '/dashboard/users', { params })
  }

  updateUser(username: string, body: AdminDashboardUpdateUserBody) {
    return this.http.post<AdminDashboardUserResponse>(environment.ADMIN_API_URL, `/dashboard/users/${username}`, body)
  }

  deleteUser(username: string) {
    return this.http.delete<void>(environment.ADMIN_API_URL, `/dashboard/users/${username}`)
  }
}
