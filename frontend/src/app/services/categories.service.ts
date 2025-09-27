import { inject, Injectable } from '@angular/core';
import { HttpApiService } from './httpApi.service';
import { CategoryResponse } from '../types/categories';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  http = inject(HttpApiService)

  getCategories() {
    return this.http.get<CategoryResponse[]>('/categories')
  }
}
