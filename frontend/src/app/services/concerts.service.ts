import { inject, Injectable } from '@angular/core';
import { HttpApiService } from './httpApi.service';
import { createConcertDetailsResponseWrapper, createConcertResponseWrapper, RawConcertDetailsResponse, RawConcertResponse } from '../types/concert';
import { map } from 'rxjs';
import { ConcertFilters, Pagination } from '../types/filters';
import { environment } from '../../environments/environment';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ConcertsService {
  private http = inject(HttpApiService)
  private jwtServie = inject(JwtService)

  getConcerts(filters = new ConcertFilters(), pagination: Pagination) {
    const params: any = { ...filters.toQueryFilters(), ...pagination }

    return this.http.get<{
      concerts: RawConcertResponse[],
      totalCount: number
    }>(environment.USER_API_URL, '/concerts', { params }).pipe(map((c) => {
      return {
        concerts: c.concerts.map(createConcertResponseWrapper),
        totalCount: c.totalCount
      }
    }))
  }

  getConcertDetails(slug: string) {
    return this.http.get<RawConcertDetailsResponse>(environment.USER_API_URL, `/concert-details/${slug}`).pipe(map((c) => {
      return createConcertDetailsResponseWrapper(c)
    }))
  }
}
