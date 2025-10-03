import { Component, inject, OnInit } from '@angular/core';
import { ConcertCard } from '../concert-card/concert-card';
import type { ConcertResponseWrapper } from '../../types/concert';
import { ConcertsService } from '../../services/concerts.service';
import { FiltersOptions } from "../filters-options/filters-options";
import { FiltersSearch } from '../filters-search/filters-search';

@Component({
  selector: 'app-concert-list',
  imports: [ConcertCard, FiltersOptions, FiltersSearch],
  templateUrl: './concert-list.html'
})
export class ConcertList implements OnInit {
  concerts: ConcertResponseWrapper[] = []

  concertApiService = inject(ConcertsService)

  ngOnInit(): void {
    this.concertApiService.getConcerts().subscribe({
      next: (c) => this.concerts = c,
      error: (e) => {
        //TODO
      }
    })
  }
}
