import { inject, Injectable } from '@angular/core';
import { HttpApiService } from './httpApi.service';
import { createConcertDetailsResponseWrapper, createConcertResponseWrapper, RawConcertDetailsResponse, RawConcertResponse } from '../types/concert';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConcertsService {
  private http = inject(HttpApiService)

  getConcerts() {
    return this.http.get<RawConcertResponse[]>('/concerts').pipe(map((c) => {
      return c.map(createConcertResponseWrapper)
    }))
  }

  getConcertDetails(slug: string) {
    return this.http.get<RawConcertDetailsResponse>(`/concert-details/${slug}`).pipe(map((c) => {
      return createConcertDetailsResponseWrapper(c)
    }))
  }
}
