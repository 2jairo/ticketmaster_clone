import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminsService } from '../../../services/admins.service';
import { AdminDashboardCategoryResponse, CategoryStatus } from '../../../types/categories';
import { AdminCategoryDialog } from './admin-category-dialog';
import { formatCategoryStatus } from '../../../utils/format';
import { Carousel } from "../../carousel/carousel";

@Component({
  selector: 'app-admin-category-card',
  imports: [ReactiveFormsModule, AdminCategoryDialog, Carousel],
  templateUrl: './admin-category-card.html',
})
export class AdminCategoryCard {
  private adminsService = inject(AdminsService)

  @Input({ required: true }) category!: AdminDashboardCategoryResponse
  @Output() onUpdatedCategory = new EventEmitter<{ slug: string, newCategory: AdminDashboardCategoryResponse }>()
  @Output() onDeletedCategory = new EventEmitter<{ slug: string }>()
  @ViewChild('settings') settingsDialog!: ElementRef<HTMLDetailsElement>

  openDialog!: (e: PointerEvent) => void

  pipeOnUpdated(event: { slug: string, newCategory: AdminDashboardCategoryResponse }) {
    this.onUpdatedCategory.emit(event)
  }

  setOpenDialog(event: (e: PointerEvent) => void) {
    this.openDialog = event
  }

  settingsDeleteCategory() {
    this.adminsService.deleteCategory(this.category.slug).subscribe(() => {
      this.settingsDialog.nativeElement.open = false
      this.onDeletedCategory.emit({ slug: this.category.slug })
    })
  }

  formatCategoryStatus(s: CategoryStatus) {
    return formatCategoryStatus(s)
  }
  formatCarouselImages(imgs: string[]) {
    return imgs.map(img => ({
      src: img,
      navigateTo: `/events?category=${this.category.slug}`
    }))
  }
}
