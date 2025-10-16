import { inject, Injectable } from '@angular/core';
import { HttpApiService } from './httpApi.service';
import { CategoryResponse, CategoryTitleResponse } from '../types/categories';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private http = inject(HttpApiService)

  getCategories() {
    return this.http.get<CategoryResponse[]>(environment.USER_API_URL, '/categories')
  }

  getCategoriesTitle() {
    return this.http.get<CategoryTitleResponse[]>(environment.USER_API_URL, '/categories-title')
  }
}
