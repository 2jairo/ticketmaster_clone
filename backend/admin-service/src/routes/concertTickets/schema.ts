import { FastifySchema } from "fastify"
import S from "fluent-json-schema"
import { paginationSchema } from "types/pagination"

const concertTicketResponse = S.object()
    .prop("id", S.string())
    .prop("sold", S.number())
    .prop("available", S.number())
    .prop("price", S.number())
    .prop("location", S.string())
    .prop("concertId", S.string())

export const CONCERT_TICKETS_PER_PAGE = 10

const concertTicketList: FastifySchema = {
    querystring: paginationSchema(CONCERT_TICKETS_PER_PAGE),
    response: {
        200: S.array().items(concertTicketResponse)
    }
}

const concertTicketsByConcert: FastifySchema = {
    params: S.object()
        .prop("slug", S.string().required()),
    response: {
        200: S.array().items(concertTicketResponse)
    }
}

export interface createConcertTicketBody {
    sold?: number
    available?: number
    price: number
    location: string
    concertSlug: string
}

const createConcertTicket: FastifySchema = {
    body: S.object()
        .prop("sold", S.number())
        .prop("available", S.number())
        .prop("price", S.number())
        .prop("location", S.string())
        .prop("concertSlug", S.string())
        .required(["price", "location", "concertSlug"]),
    response: {
        201: concertTicketResponse
    }
}

export interface updateConcertTicketBody {
    sold?: number
    available?: number
    price?: number
    location?: string
    concertSlug?: string
}

const updateConcertTicket: FastifySchema = {
    params: S.object()
        .prop("id", S.string().required()),
    body: S.object()
        .prop("sold", S.number())
        .prop("available", S.number())
        .prop("price", S.number())
        .prop("location", S.string())
        .prop("concertSlug", S.string())
        .minProperties(1),
    response: {
        200: concertTicketResponse
    }
}

const getConcertTicket: FastifySchema = {
    params: S.object()
        .prop("id", S.string().required()),
    response: {
        200: concertTicketResponse
    }
}

const deleteConcertTicket: FastifySchema = {
    params: S.object()
        .prop("id", S.string().required()),
    response: {
        204: S.null()
    }
}

export const dashboardConcertTicketsSchemas = { 
    concertTicketList, 
    concertTicketsByConcert,
    createConcertTicket, 
    updateConcertTicket,
    getConcertTicket,
    deleteConcertTicket
}
