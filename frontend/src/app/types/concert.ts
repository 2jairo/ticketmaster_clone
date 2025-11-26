import { formatDate } from "../utils/format"
import { MusicGroupResponse } from "./musicGroupts"

export interface RawConcertResponse {
  slug: string
  title: string
  dateStart: string
  images: {
    carousel: string[]
  },
  locationName: string,
  dateEnd: string
  description: string
  tickets: {
    available: number
    sold: number
    priceMin: number
    priceMax: number
  }
}

export type ConcertResponseWrapper = ReturnType<typeof createConcertResponseWrapper>

const soldPercent = (tickets: { available: number, sold: number }) => {
  if (tickets.available + tickets.sold === 0) return 0
  return Math.min(100, Math.max(0, (tickets.sold / (tickets.available + tickets.sold)) * 100))
}

export const createConcertResponseWrapper = (rawConcert: RawConcertResponse) => {
  const c = {
    ...rawConcert,
    dateStart: new Date(rawConcert.dateStart),
    dateEnd: new Date(rawConcert.dateEnd),
  }

  return {
    ...c,
    tickets: {
      ...c.tickets,
      priceMax: c.tickets.priceMax / 100,
      priceMin: c.tickets.priceMin / 100,
    },
    formattedDateStart: formatDate(c.dateStart),
    formattedDateEnd: formatDate(c.dateEnd),
    soldPercent: () => soldPercent(c.tickets)
  }
}


export interface RawConcertDetailsResponse {
  slug: string
  title: string
  dateStart: string
  images: {
    carousel: string[],
    map?: string,
    thumbnail?: string
  }
  dateEnd: string
  description: string
  locationName: string,
  location: {
    type: string,
    coordinates: [number, number]
  }
  tickets: {
    available: number
    sold: number
    price: number,
    location: string,
    _id: string
  }[]
  categories: {
    title: string,
    slug: string
  }[]
  groups: MusicGroupResponse[]
}
export type ConcertDetailsResponseWrapper = ReturnType<typeof createConcertDetailsResponseWrapper>

export const createConcertDetailsResponseWrapper = (rawConcert: RawConcertDetailsResponse) => {
  const c = {
    ...rawConcert,
    dateStart: new Date(rawConcert.dateStart),
    dateEnd: new Date(rawConcert.dateEnd)
  }

  return {
    ...c,
    formattedDateStart: formatDate(c.dateStart),
    formattedDateEnd: formatDate(c.dateEnd),
    tickets: c.tickets.map((t) => ({
      ...t,
      price: t.price / 100,
      soldPercent: soldPercent(t)
    }))
  }
}
