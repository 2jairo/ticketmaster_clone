import { Component, inject, OnInit } from '@angular/core';
import { ConcertCard } from '../concert-card/concert-card';
import type { ConcertResponseWrapper } from '../../types/concert';
import { CONCERTS_PAGE_SIZE, ConcertsService } from '../../services/concerts.service';
import { FiltersOptions } from "../filters-options/filters-options";
import { ConcertFilters } from '../../types/filters';
import { tap } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-concert-list',
  imports: [ConcertCard, FiltersOptions],
  templateUrl: './concert-list.html'
})
export class ConcertList implements OnInit {
  concerts: ConcertResponseWrapper[] = []

  fetching = true
  currentPage = 1
  pages: number[] = []
  offset = 0
  filters = new ConcertFilters()

  private concertApiService = inject(ConcertsService)
  private location = inject(Location)

  ngOnInit(): void {
    this.getUrlFilters()
    this.onFiltersChange(this.filters)
  }

  onFiltersChange(filters: ConcertFilters) {
    this.fetching = true

    this.concertApiService.getConcerts(filters, { size: CONCERTS_PAGE_SIZE, offset: this.offset })
      .pipe(tap(() => {
        this.fetching = false
      }))
      .subscribe({
        next: (c) => {
          this.concerts = c.concerts
          this.filters = filters
          this.updateUrlFilters()

          this.pages = Array.from({ length: Math.ceil(c.totalCount / CONCERTS_PAGE_SIZE) }, (_, i) => i + 1)
          this.currentPage = 1
        },
        error: (e) => {
          //TODO
        }
      })
  }

  updateUrlFilters() {
    const p = new URLSearchParams()

    for (const [key, value] of Object.entries(this.filters.toQueryFilters())) {
      if (Array.isArray(value) && value.length > 0) {
        p.append(key, value.join(','))
      } else {
        const stringValue = String(value)
        if(stringValue) {
          p.append(key, stringValue)
        }
      }
    }

    const pathWithoutQuery = this.location.path(false).split('?')[0]
    this.location.go(`${pathWithoutQuery}?${p.toString()}`)
  }

  getUrlFilters() {
    const queryParams = new URLSearchParams(window.location.search);
    const filters = new ConcertFilters()

    for (const [key, value] of queryParams.entries()) {
      if(key === 'title' || key === 'category') {
        filters[key] = value
      }
      else if(key === 'priceMax' || key === 'priceMin') {
        filters.setPrice(key, value)
      }
      else if(key === 'dateStart' || key === 'dateEnd') {
        filters.setDate(key, value)
      }
    }

    this.filters = filters
  }

  setPage(page: number) {
    if (page < 1 || page > this.pages.length) {
      return
    }

    this.currentPage = page
    this.offset = (page - 1) * CONCERTS_PAGE_SIZE
    this.fetching = true

    this.concertApiService.getConcerts(this.filters, { size: CONCERTS_PAGE_SIZE, offset: this.offset })
      .pipe(tap(() => {
        this.fetching = false
      }))
      .subscribe({
        next: (c) => {
          this.concerts = c.concerts
          window.scrollTo({ top: 0 })
        }
      })
  }
}
