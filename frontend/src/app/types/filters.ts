import { formatDate } from "../utils/format"

export interface Pagination {
  offset: number
  size: number
}


export class ConcertFilters {
  readonly PRICE_MIN = 0
  readonly PRICE_MAX = 3000
  readonly DATE_MIN = {
    num: Date.now() - (86400000 * 365),
    formatted: formatDate(new Date(Date.now() - (86400000 * 365)))
  }
  readonly DATE_MAX = {
    num: Date.now() + (86400000 * 365 * 2),
    formatted: formatDate(new Date(Date.now() + (86400000 * 365 * 2)))
  }

  title?: string
  category?: string = ''
  priceMax?: number
  priceMin?: number
  dateStart?: {
    num: number,
    formatted: string
  }
  dateEnd?: {
    num: number,
    formatted: string
  }
  sortBy?: 'nearest' | 'most_sold' | 'starting_soon' | '' = ''


  setPrice(key: 'priceMax' | 'priceMin', value: string | number) {
    const n = typeof value === 'number' ? value : parseInt(value)

    if(!isNaN(n)) {
      this[key] = Math.min(this.PRICE_MAX, Math.max(this.PRICE_MIN, n))
    }
  }


  setDate(key: 'dateStart' | 'dateEnd', value: string | number) {
    const d = new Date(value)

    if(!isNaN(d.getTime())) {
      if (d.getTime() >= this.DATE_MIN.num && d.getTime() <= this.DATE_MAX.num) {

        this[key] = {
          num: d.getTime(),
          formatted: formatDate(d)
        }
      }
    }
  }

  toQueryFilters() {
    const filters: Record<string, any> = {}

    if (this.sortBy) filters["sortBy"] = this.sortBy
    if (this.title) filters["title"] = this.title
    if (this.category) filters["category"] = this.category
    if (this.priceMax !== undefined) filters["priceMax"] = this.priceMax
    if (this.priceMin !== undefined) filters["priceMin"] = this.priceMin
    if (this.dateStart !== undefined) filters["dateStart"] = new Date(this.dateStart.num).toISOString()
    if (this.dateEnd !== undefined) filters["dateEnd"] = new Date(this.dateEnd.num).toISOString()

    return filters
  }
}


export class ShopFilters {
  readonly PRICE_MIN = 0
  readonly PRICE_MAX = 3000

  title?: string
  concert?: string
  priceMax?: number
  priceMin?: number
  withStock?: boolean

  setPrice(key: 'priceMax' | 'priceMin', value: string | number) {
    const n = typeof value === 'number' ? value : parseInt(value)

    if(!isNaN(n)) {
      this[key] = Math.min(this.PRICE_MAX, Math.max(this.PRICE_MIN, n))
    }
  }

  toQueryFilters() {
    const filters: Record<string, any> = {}

    if (this.title) filters["title"] = this.title
    if (this.concert) filters["concert"] = this.concert
    if (this.priceMax !== undefined) filters["priceMax"] = this.priceMax
    if (this.priceMin !== undefined) filters["priceMin"] = this.priceMin
    if (this.withStock !== undefined) filters["withStock"] = this.withStock

    return filters
  }
}
