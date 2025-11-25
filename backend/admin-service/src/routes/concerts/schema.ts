import { FastifySchema } from "fastify"
import S from "fluent-json-schema"
import { ConcertStatus } from "generated/prisma/enums"
import { CATEGORY_STATUS } from "schemas/category"
import { paginationSchema } from "types/pagination"

export const CONCERT_STATUS = Object.values(ConcertStatus)

const concertLocationSchema = S.object()
	.prop("type", S.string())
	.prop("coordinates", S.array().items(S.number()))

const musicGroupResponse = S.object()
	.prop("slug", S.string())
	.prop("title", S.string())
	.prop("image", S.string())
	.prop("status", S.enum(CONCERT_STATUS))
	.prop("isActive", S.boolean())

const categoriesResponse = S.object()
	.prop("slug", S.string())
	.prop("title", S.string())
	.prop("status", S.enum(CATEGORY_STATUS))
	.prop("isActive", S.boolean())

const ticketsResponse = S.object()
	.prop("id", S.string())
	.prop("location", S.string())
	.prop("available", S.number())
	.prop("price", S.number())
	.prop("sold", S.number())
	
const concertResponse = S.object()
	.prop("slug", S.string())
	.prop("title", S.string())
	.prop("dateStart", S.string().format("date-time"))
	.prop("dateEnd", S.string().format("date-time"))
	.prop("description", S.string())
	.prop("images", S.array().items(S.string()))
	.prop("mapImg", S.string())
	.prop("thumbnailImg", S.string())
	.prop("locationName", S.string())
	.prop("location", concertLocationSchema)
	.prop("groups", S.array().items(musicGroupResponse))
	.prop("categories", S.array().items(categoriesResponse))
	.prop("tickets", S.array().items(ticketsResponse))
	.prop("totalTicketsSold", S.number())
	.prop("status", S.enum(CONCERT_STATUS))
	.prop("isActive", S.boolean())

export const CONCERTS_PER_PAGE = 10

const concertList: FastifySchema = {
	querystring: paginationSchema(CONCERTS_PER_PAGE),
	response: {
		200: S.array().items(concertResponse)
	}
}

export interface createConcertBody {
	title: string
	dateStart: Date
	dateEnd: Date
	description: string
	images?: string[]
	mapImg?: string
	thumbnailImg?: string
	locationName: string
	location: {
		type: string
		coordinates: number[]
	}
	groupSlugs?: string[]
	categorySlugs?: string[]
	status?: ConcertStatus
	isActive?: boolean
}

const createConcert: FastifySchema = {
	body: S.object()
		.prop("title", S.string())
		.prop("dateStart", S.string().format("date-time"))
		.prop("dateEnd", S.string().format("date-time"))
		.prop("description", S.string())
		.prop("images", S.array().items(S.string()))
		.prop("mapImg", S.string())
		.prop("thumbnailImg", S.string())
		.prop("locationName", S.string())
		.prop("location", concertLocationSchema)
		.prop("groupSlugs", S.array().items(S.string()))
		.prop("categorySlugs", S.array().items(S.string()))
		.prop("status", S.enum(CONCERT_STATUS))
		.prop("isActive", S.boolean())
		.required(["title", "dateStart", "dateEnd", "description", "locationName", "location"]),
	response: {
		201: concertResponse
	}
}

export interface updateConcertBody {
	title?: string
	slug?: string
	dateStart?: Date
	dateEnd?: Date
	description?: string
	images?: string[]
	mapImg?: string
	thumbnailImg?: string
	locationName?: string
	location?: {
		type: string
		coordinates: number[]
	}
	groupSlugs?: string[]
	categorySlugs?: string[]
	status?: ConcertStatus
	isActive?: boolean
}

const updateConcert: FastifySchema = {
	body: S.object()
		.prop("title", S.string())
		.prop("slug", S.string())
		.prop("dateStart", S.string().format("date-time"))
		.prop("dateEnd", S.string().format("date-time"))
		.prop("description", S.string())
		.prop("images", S.array().items(S.string()))
		.prop("mapImg", S.string())
		.prop("thumbnailImg", S.string())
		.prop("locationName", S.string())
		.prop("location", concertLocationSchema)
		.prop("groupSlugs", S.array().items(S.string()))
		.prop("categorySlugs", S.array().items(S.string()))
		.prop("status", S.enum(CONCERT_STATUS))
		.prop("isActive", S.boolean())
		.minProperties(1),
	response: {
		200: concertResponse
	}
}

export const dashboardConcertSchemas = { concertList, createConcert, updateConcert }
