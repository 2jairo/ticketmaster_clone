import { inject, Injectable } from '@angular/core';
import { HttpApiService } from './httpApi.service';
import { environment } from '../../environments/environment';
import { Pagination } from '../types/filters';
import { MerchDashboardMerchandisingResponse, MerchDashboardCreateMerchandisingBody, MerchDashboardUpdateMerchandisingBody, MerchDashboardMerchCategoryResponse, MerchDashboardCreateMerchCategoryBody, MerchDashboardUpdateMerchCategoryBody } from '../types/merchDashboard';


@Injectable({
  providedIn: 'root'
})
export class MerchandisingService {
  private http = inject(HttpApiService)

  getMerchandising(pagination: Pagination) {
    const params = { ...pagination }
    return this.http.get<MerchDashboardMerchandisingResponse[]>(environment.MERCH_API_URL, '/merch', { params })
  }

  createMerchandise(body: MerchDashboardCreateMerchandisingBody) {
    return this.http.post<MerchDashboardMerchandisingResponse>(environment.MERCH_API_URL, '/merch', body)
  }

  updateMerchandise(slug: string, body: MerchDashboardUpdateMerchandisingBody) {
    return this.http.update<MerchDashboardMerchandisingResponse>(environment.MERCH_API_URL, `/merch/${slug}`, body)
  }

  deleteMerchanside(slug: string) {
    return this.http.delete(environment.MERCH_API_URL, `/merch/${slug}`)
  }

  // -----

  getMerchCategories() {
    return this.http.get<MerchDashboardMerchCategoryResponse[]>(environment.MERCH_API_URL, '/merch/categories')
  }

  createMerchCategory(body: MerchDashboardCreateMerchCategoryBody) {
    return this.http.post<MerchDashboardMerchCategoryResponse>(environment.MERCH_API_URL, '/merch/categories', body)
  }

  updateMerchCategory(slug: string, body: MerchDashboardUpdateMerchCategoryBody) {
    return this.http.update<MerchDashboardMerchCategoryResponse>(environment.MERCH_API_URL, `/merch/categories/${slug}`, body)
  }

  deleteMerchCategory(slug: string) {
    return this.http.delete<MerchDashboardMerchCategoryResponse>(environment.MERCH_API_URL, `/merch/categories/${slug}`)
  }
}
