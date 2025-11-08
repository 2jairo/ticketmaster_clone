import { inject, Injectable } from '@angular/core';
import { HttpApiService } from './httpApi.service';
import { environment } from '../../environments/environment';
import { AdminDashboardUpdateUserBody, AdminDashboardUserResponse } from '../types/adminDashboard';
import { Pagination } from '../types/filters';
import { AdminDashboardMusicGroupResponse } from '../types/musicGroupts';


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

  getMusicGroupList(pagination: Pagination) {
    const params = { ...pagination }
    return this.http.get<AdminDashboardMusicGroupResponse[]>(environment.ADMIN_API_URL, '/dashboard/groups', { params })
  }

  updateMusicGroup(slug: string, body: any) {
    return this.http.post<AdminDashboardMusicGroupResponse>(environment.ADMIN_API_URL, `/dashboard/groups/${slug}`, body)
  }

  deleteMusicGroup(slug: string) {
    return this.http.delete<void>(environment.ADMIN_API_URL, `/dashboard/groups/${slug}`)
  }

  createMusicGroup(body: any) {
    return this.http.post<AdminDashboardMusicGroupResponse>(environment.ADMIN_API_URL, `/dashboard/groups`, body)
  }
}
