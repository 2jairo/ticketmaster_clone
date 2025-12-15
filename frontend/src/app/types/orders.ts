export interface OrderResponse {
  id: string
  tickets: {
    quantity: number
    id: string
    sold: number
    available: number
    price: number
    location: string
    concertSlug: string
    concertTitle: string
  }[]
  merch: {
    quantity: number
    id: string
    sold: number
    price: number
    title: string
    slug: string
    description: string
    images: string[]
    categoryId: string
    stock: number
  }[]
  status: 'CANCELED' | 'FAILED' | 'PAID' | 'PENDING'
  totalAmmount: number
  createdAt: string
  updatedAt: string | null
  paymemt?: {
    totalAmmount: number
    method: string
    currency: string
    transactionRef: string
    status: 'PENDING' | 'COMPLETED'
    createdAt: string
    paidAt: string | null
  }
}
