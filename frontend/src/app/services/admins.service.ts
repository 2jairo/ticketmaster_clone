import { inject, Injectable } from '@angular/core';
import { HttpApiService } from './httpApi.service';
import { environment } from '../../environments/environment';
import { AdminDashboardConcertResponse, AdminDashboardCreateConcertResponse, AdminDashboardUpdateConcertResponse, AdminDashboardUpdateUserBody, AdminDashboardUserResponse } from '../types/adminDashboard';
import { Pagination } from '../types/filters';
import { AdminDashboardCreateMusicGroupBody, AdminDashboardMusicGroupResponse, AdminDashboardUpdateMusicGroupBody } from '../types/musicGroupts';
import { AdminDashboardCategoryResponse, AdminDashboardCreateCategoryBody, AdminDashboardUpdateCategoryBody } from '../types/categories';
import { AdminDashboardConcertTicketResponse, AdminDashboardCreateConcertTicket, AdminDashboardUpdateConcertTicket } from '../types/concertTickets';


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

  updateMusicGroup(slug: string, body: AdminDashboardUpdateMusicGroupBody) {
    return this.http.post<AdminDashboardMusicGroupResponse>(environment.ADMIN_API_URL, `/dashboard/groups/${slug}`, body)
  }

  deleteMusicGroup(slug: string) {
    return this.http.delete<void>(environment.ADMIN_API_URL, `/dashboard/groups/${slug}`)
  }

  createMusicGroup(body: AdminDashboardCreateMusicGroupBody) {
    return this.http.post<AdminDashboardMusicGroupResponse>(environment.ADMIN_API_URL, `/dashboard/groups`, body)
  }

  /* Categories admin endpoints */
  getCategoryList(pagination: Pagination) {
    const params = { ...pagination }
    return this.http.get<AdminDashboardCategoryResponse[]>(environment.ADMIN_API_URL, '/dashboard/categories', { params })
  }

  updateCategory(slug: string, body: AdminDashboardUpdateCategoryBody) {
    return this.http.post<AdminDashboardCategoryResponse>(environment.ADMIN_API_URL, `/dashboard/categories/${slug}`, body)
  }

  deleteCategory(slug: string) {
    return this.http.delete<void>(environment.ADMIN_API_URL, `/dashboard/categories/${slug}`)
  }

  createCategory(body: AdminDashboardCreateCategoryBody) {
    return this.http.post<AdminDashboardCategoryResponse>(environment.ADMIN_API_URL, `/dashboard/categories`, body)
  }

  // concerts
  getConcertList(pagination: Pagination) {
    const params = { ...pagination }
    return this.http.get<AdminDashboardConcertResponse[]>(environment.ADMIN_API_URL, '/dashboard/concerts', { params })
  }

  updateConcert(slug: string, body: AdminDashboardUpdateConcertResponse) {
    return this.http.post<AdminDashboardConcertResponse>(environment.ADMIN_API_URL, `/dashboard/concerts/${slug}`, body)
  }

  deleteConcert(slug: string) {
    return this.http.delete<void>(environment.ADMIN_API_URL, `/dashboard/concerts/${slug}`)
  }

  createConcert(body: AdminDashboardCreateConcertResponse) {
    return this.http.post<AdminDashboardConcertResponse>(environment.ADMIN_API_URL, `/dashboard/concerts`, body)
  }

  // concert tickets
  getConcertTicketList(pagination: Pagination) {
    const params = { ...pagination }
    return this.http.get<AdminDashboardConcertTicketResponse[]>(environment.ADMIN_API_URL, '/dashboard/concert-tickets', { params })
  }

  updateConcertTicket(id: string, body: AdminDashboardUpdateConcertTicket) {
    return this.http.update<AdminDashboardConcertTicketResponse>(environment.ADMIN_API_URL, `/dashboard/concert-tickets/${id}`, body)
  }

  deleteConcertTicket(id: string) {
    return this.http.delete<void>(environment.ADMIN_API_URL, `/dashboard/concert-tickets/${id}`)
  }

  createConcertTicket(body: AdminDashboardCreateConcertTicket) {
    return this.http.post<AdminDashboardConcertTicketResponse>(environment.ADMIN_API_URL, `/dashboard/concert-tickets`, body)
  }
}
