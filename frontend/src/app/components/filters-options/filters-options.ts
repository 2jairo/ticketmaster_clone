import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CategoryTitleResponse } from '../../types/categories';
import { CategoriesService } from '../../services/categories.service';
import { MinMaxInput } from './min-max-input';
import { ConcertFilters } from '../../types/filters';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters-options',
  imports: [MinMaxInput, FormsModule],
  templateUrl: './filters-options.html'
})
export class FiltersOptions implements OnInit {
  categories: CategoryTitleResponse[] = []

  filters = new ConcertFilters()

  @Input() startFilters: ConcertFilters = new ConcertFilters()

  // dateStart = new Date(this.filters.DATE_MIN).toISOString().split('T')[0]
  // dateEnd = new Date(this.filters.DATE_MAX).toISOString().split('T')[0]
  debounceTimeout: number = -1

  @Output() filtersChange = new EventEmitter<ConcertFilters>()

  categoriesService = inject(CategoriesService)

  ngOnInit(): void {
    this.filters = this.startFilters

    this.categoriesService.getCategoriesTitle().subscribe({
      next: (c) => this.categories = c
    })
  }

  minMaxChange(e: { min: number, max: number }, dest: 'price' | 'date') {
    if (dest === 'date') {
      if (e.min !== this.filters.DATE_MIN.num) {
        this.filters.setDate('dateStart', e.min)
      }
      if (e.max !== this.filters.DATE_MAX.num) {
        this.filters.setDate('dateEnd', e.max)
      }
    } else {
      if (e.min !== this.filters.PRICE_MIN) {
        this.filters.setPrice('priceMin', e.min)
      }
      if (e.max !== this.filters.PRICE_MAX) {
        this.filters.setPrice('priceMax', e.max)
      }
    }
    this.sendFilters()
  }

  resetFilters() {
    this.filters = new ConcertFilters()
    this.filtersChange.emit(this.filters)
  }

  sendFilters() {
    clearTimeout(this.debounceTimeout)

    this.debounceTimeout = setTimeout(() => {
      this.filtersChange.emit(this.filters)
    }, 500)
  }
}
