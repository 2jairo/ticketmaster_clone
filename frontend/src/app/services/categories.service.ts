import { inject, Injectable } from '@angular/core';
import { HttpApiService } from './httpApi.service';
import { CategoryResponse, CategoryTitleResponse } from '../types/categories';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  http = inject(HttpApiService)

  getCategories() {
    return this.http.get<CategoryResponse[]>('/categories')
  }

  getCategoriesTitle() {
    return this.http.get<CategoryTitleResponse[]>('/categories-title')
  }
}
