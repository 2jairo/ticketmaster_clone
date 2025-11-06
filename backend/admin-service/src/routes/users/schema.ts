import { FastifySchema } from "fastify"
import S from "fluent-json-schema"
import { paginationSchema } from "types/pagination"

export const USERS_PER_PAGE = 10
const userList: FastifySchema = {
    querystring: paginationSchema(USERS_PER_PAGE)
}


export const dashboardUserSchemas = { userList }