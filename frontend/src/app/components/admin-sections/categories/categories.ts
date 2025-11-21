import { Component, inject, OnInit, signal } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Pagination } from '../../categories/filters';
import { AdminsService } from '../../../services/admins.service';
import { environment } from '../../../../environments/environment';
import { AdminDashboardCategoryResponse, DEFAULT_CATEGORY } from '../../../types/categories';
import { AdminCategoryCard } from './admin-category-card';
import { AdminCategoryDialog } from './admin-category-dialog';
import { LoadingGif } from "../../loading-gif/loading-gif";

@Component({
  selector: 'app-categories',
  imports: [InfiniteScrollDirective, AdminCategoryCard, AdminCategoryDialog, LoadingGif],
  styleUrls: ['../common.css'],
  templateUrl: './categories.html',
})
export class Categories implements OnInit {
  private adminsService = inject(AdminsService)
  categories = signal<AdminDashboardCategoryResponse[]>([])

  openDialog!: (e: PointerEvent) => void

  ngOnInit(): void {
    this.loadCategories()
  }

  setOpenDialog(event: (e: PointerEvent) => void) {
    this.openDialog = event
  }

  pagination: Pagination = {
    offset: 0,
    // reuse music groups page size when a dedicated categories size isn't configured
    size: environment.ADMIN_DASHBOARD_MUSIC_GROUPS_PAGE_SIZE
  }

  loading = false
  allLoaded = false
  loadCategories() {
    if (this.loading || this.allLoaded) return

    this.loading = true
    this.adminsService.getCategoryList(this.pagination).subscribe({
      next: (newCategories) => {
        if (newCategories.length === 0) {
          this.allLoaded = true
        } else {
          this.categories.update((prev) => [...prev, ...newCategories])
          this.pagination.offset += newCategories.length
        }
      },
      complete: () => this.loading = false
    })
  }

  updateCategory({ slug, newCategory }: { slug: string, newCategory: AdminDashboardCategoryResponse }) {
    this.categories.update(prev => {
      const idx = prev.findIndex(u => u.slug === slug)
      if (idx === -1) return prev

      const copy = prev.slice()
      copy[idx] = newCategory
      return copy
    })
  }

  addCategory(newCategory: AdminDashboardCategoryResponse) {
    this.categories.update(prev => [newCategory, ...prev])
    this.pagination.offset += 1
  }

  deleteCategory({ slug }: { slug: string }) {
    this.categories.update(prev => {
      const idx = prev.findIndex(u => u.slug === slug)
      if (idx === -1) return prev

      const copy = prev.slice()
      copy.splice(idx, 1)
      if (this.pagination.offset > 0) this.pagination.offset -= 1

      return copy
    })
  }

  getDefaultCategory() {
    return structuredClone(DEFAULT_CATEGORY)
  }

}
