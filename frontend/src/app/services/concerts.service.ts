import { inject, Injectable } from '@angular/core';
import { HttpApiService } from './httpApi.service';
import { createConcertDetailsResponseWrapper, createConcertResponseWrapper, RawConcertDetailsResponse, RawConcertResponse } from '../types/concert';
import { map } from 'rxjs';
import { ConcertFilters, Pagination } from '../types/filters';

export const CONCERTS_PAGE_SIZE = 5

@Injectable({
  providedIn: 'root'
})
export class ConcertsService {
  private http = inject(HttpApiService)

  getConcerts(filters = new ConcertFilters(), pagination: Pagination) {
    const params: any = { ...filters.toQueryFilters(), ...pagination }

    return this.http.get<{
      concerts: RawConcertResponse[],
      totalCount: number
    }>('/concerts', { params }).pipe(map((c) => {
      return {
        concerts: c.concerts.map(createConcertResponseWrapper),
        totalCount: c.totalCount
      }
    }))
  }

  getConcertDetails(slug: string) {
    return this.http.get<RawConcertDetailsResponse>(`/concert-details/${slug}`).pipe(map((c) => {
      return createConcertDetailsResponseWrapper(c)
    }))
  }
}
