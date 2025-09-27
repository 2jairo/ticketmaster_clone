import { inject, Injectable } from '@angular/core';
import { HttpApiService } from './httpApi.service';
import { parseRawConcertResponse, RawConcertResponse } from '../types/concert';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConcertsService {
  http = inject(HttpApiService)

  getConcerts() {
    return this.http.get<RawConcertResponse[]>('/concerts').pipe(map((c) => {
      return c.map(parseRawConcertResponse)
    }))
  }
}
