export interface CategoryResponse {
  title: string
  slug: string
  images: string[]
}

export interface CategoryTitleResponse {
  title: string
  slug: string
}

// Admin dashboard types for categories (used by admin sections)
export interface AdminDashboardCategoryResponse {
  slug: string
  title: string
  images: string[]
  status: CategoryStatus
  isActive: boolean
  concerts: number
}

export interface AdminDashboardCreateCategoryBody {
  title: string
  images?: string[]
  status?: CategoryStatus
  isActive?: boolean
}

export interface AdminDashboardUpdateCategoryBody {
  title?: string
  images?: string[]
  status?: CategoryStatus
  isActive?: boolean
}

export type CategoryStatus = 'ACCEPTED' | 'REJECTED' | 'PENDING'
export const CATEGORY_STATUS: CategoryStatus[] = ['ACCEPTED', 'REJECTED', 'PENDING']

export const DEFAULT_CATEGORY: AdminDashboardCategoryResponse = {
  slug: '',
  title: '',
  images: ['https://static.productionready.io/images/smiley-cyrus.jpg'],
  status: 'PENDING',
  isActive: true,
  concerts: 0
}
