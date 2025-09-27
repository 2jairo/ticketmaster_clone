export interface RawConcertResponse {
  title: string
  dateStart: string
  dateEnd: string
  description: string
  tickets: {
    available: number
    sold: number
    price: number
  }
}

export interface ConcertResponse {
  title: string
  dateStart: Date
  dateEnd: Date
  description: string
  tickets: {
    available: number
    sold: number
    price: number
  }
}

export const parseRawConcertResponse = (c: RawConcertResponse): ConcertResponse => {
  return {
    ...c,
    dateStart: new Date(c.dateStart),
    dateEnd: new Date(c.dateEnd)
  }
}
