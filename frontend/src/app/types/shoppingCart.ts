export interface ShoppingCartResponse {
  tickets: {
    item: {
      id: string
      sold: number
      available: number
      price: number
      location: string
      concertSlug: string
      concertTitle: string
      concertImages: string[]
    }
    quantity: number
  }[]
  merch: {
    item: {
      id: string
      title: string
      slug: string
      images: string[]
      stock: number
      sold: number
      price: number
    }
    quantity: number
  }[]
}

export interface UpdateShoppingCartBody {
  tickets?: {
    itemId: string
    quantity: number
  }[]
  merch?: {
    itemId: string
    quantity: number
  }[]
}
