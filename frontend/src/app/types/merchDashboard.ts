export interface MerchDashboardMerchandisingResponse {
  title: string
  slug: string
  images: string[]
  description: string
  category: {
    title: string
    slug: string
    image: string
  }
  stock: number
  sold: number
  price: number
}


export interface MerchDashboardCreateMerchandisingBody {
  title: string
  images: string[]
  description: string
  categorySlug: string
  stock: number
  price: number
}

export type MerchDashboardUpdateMerchandisingBody = Partial<MerchDashboardCreateMerchandisingBody>

export const DEFAULT_MERCH: MerchDashboardMerchandisingResponse = {
  title: '',
  slug: '',
  images: [],
  description: '',
  category: {
    image: '',
    slug: '',
    title: ''
  },
  stock: 0,
  sold: 0,
  price: 0,
}
