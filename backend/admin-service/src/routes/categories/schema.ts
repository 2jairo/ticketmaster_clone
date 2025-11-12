import { FastifySchema } from "fastify"
import S from "fluent-json-schema"
import { CategoryStatus } from "generated/prisma/enums"
import { CATEGORY_STATUS } from "schemas/category"
import { paginationSchema } from "types/pagination"

const categoryResponse = S.object()
    .prop("slug", S.string())
    .prop("title", S.string())
    .prop("images", S.array().items(S.string()))
    .prop("status", S.enum(CATEGORY_STATUS))
    .prop("isActive", S.boolean())
    .prop("concerts", S.number())

export const CATEGORIES_PER_PAGE = 10

const categoryList: FastifySchema = {
    querystring: paginationSchema(CATEGORIES_PER_PAGE),
    response: {
        200: S.array().items(categoryResponse)
    }
}

export interface createCategoryBody {
    title: string
    images?: string[]
    status?: CategoryStatus
    isActive?: boolean
}

const createCategory: FastifySchema = {
    body: S.object()
        .prop("title", S.string())
        .prop("images", S.array().items(S.string()))
        .prop("status", S.enum(CATEGORY_STATUS))
        .prop("isActive", S.boolean())
        .required(["title"]),
    response: {
        201: categoryResponse
    }
}

export interface updateCategoryBody {
    title?: string
    slug?: string
    images?: string[]
    status?: CategoryStatus
    isActive?: boolean
}

const updateCategory: FastifySchema = {
    body: S.object()
        .prop("title", S.string())
        .prop("slug", S.string())
        .prop("images", S.array().items(S.string()))
        .prop("status", S.enum(CATEGORY_STATUS))
        .prop("isActive", S.boolean())
        .minProperties(1),
    response: {
        200: categoryResponse
    }
}

export const dashboardCategoriesSchemas = { categoryList, createCategory, updateCategory }
