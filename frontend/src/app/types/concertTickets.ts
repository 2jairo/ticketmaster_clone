
export interface AdminDashboardConcertTicketResponse {
  id: string;
  sold: number;
  available: number;
  price: number;
  location: string;
  concertSlug: string;
}

export interface AdminDashboardCreateConcertTicket {
  available: number
  price: number
  location: string
  concertSlug: string
}

export type AdminDashboardUpdateConcertTicket = Partial<AdminDashboardCreateConcertTicket>

export const DEFAULT_CONCERT_TICKET: AdminDashboardConcertTicketResponse = {
  id: '',
  sold: 0,
  available: 0,
  price: 0,
  location: '',
  concertSlug: ''
}
