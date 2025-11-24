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
  images: ['https://static.productionready.io/images/smiley-cyrus.jpg'],
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


//-----------------

export interface MerchDashboardMerchCategoryResponse {
  title: string
  slug: string
  image: string
  _count: {
    products: number
  }
}

export interface MerchDashboardCreateMerchCategoryBody {
  title: string
  image: string
}

export type MerchDashboardUpdateMerchCategoryBody = Partial<MerchDashboardCreateMerchCategoryBody>


export const DEFAULT_MERCH_CATEGORY: MerchDashboardMerchCategoryResponse = {
  title: '',
  slug: '',
  image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
  _count: {
    products: 0
  }
}
