import { inject, Injectable } from '@angular/core';
import { HttpApiService } from './httpApi.service';
import { createConcertResponseWrapper, RawConcertResponse } from '../types/concert';
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
}
