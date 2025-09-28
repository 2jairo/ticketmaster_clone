export interface RawConcertResponse {
  slug: string
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

export type ConcertResponseWrapper = ReturnType<typeof createConcertResponseWrapper>

export const createConcertResponseWrapper = (rawConcert: RawConcertResponse) => {
  const c = {
    ...rawConcert,
    dateStart: new Date(rawConcert.dateStart),
    dateEnd: new Date(rawConcert.dateEnd)
  }

  const formattedDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  const soldPercent = () => {
    if (c.tickets.available + c.tickets.sold === 0) return 0
    return Math.min(100, Math.max(0, (c.tickets.sold / (c.tickets.available + c.tickets.sold)) * 100))
  }

  return {
    ...c,
    formattedDateStart: () => formattedDate(c.dateStart),
    formattedDateEnd: () => formattedDate(c.dateEnd),
    soldPercent
  }
}


export interface RawConcertDetailsResponse {

}
