export interface Pagination {
  offset: number
  size: number
}

// export interface ConcertFilters {
//   title?: string
//   category?: string
//   priceMax?: number
//   priceMin?: number
//   dateStart?: string
//   dateEnd?: string
// }

export const PRICE_MIN = 0
export const PRICE_MAX = 3000
export const DATE_MIN = Date.now() - (86400000 * 365)
export const DATE_MAX = Date.now() + (86400000 * 365 * 2)

export class ConcertFilters {
  title?: string
  category?: string
  priceMax?: number
  priceMin?: number
  dateStart?: string
  dateEnd?: string


}
