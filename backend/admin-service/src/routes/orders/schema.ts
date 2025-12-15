import { FastifySchema } from "fastify"
import S from "fluent-json-schema"
import { PaymentStatus } from "generated/prisma/enums"
import { ORDER_STATUS } from "schemas/order"
import { paginationSchema } from "types/pagination"


const PAYMENT_STATUS: PaymentStatus[] = ["PENDING", "COMPLETED"]

const orderTickets = S.object()
    .prop("quantity", S.number())
    .prop("id", S.string())
    .prop("sold", S.number())
    .prop("available", S.number())
    .prop("price", S.number())
    .prop("location", S.string())
    .prop("concertSlug", S.string())
    .prop("concertTitle", S.string())

const orderMerch = S.object()
    .prop("quantity", S.number())
    .prop("id", S.string())
    .prop("sold", S.number())
    .prop("price", S.number())
    .prop("title", S.string())
    .prop("slug", S.string())
    .prop("description", S.string())
    .prop("images", S.array().items(S.string()))
    .prop("categoryId", S.string())
    .prop("stock", S.number())


const paymentSchema = S.object()
    .prop("totalAmmount", S.number())
    .prop("method", S.string())
    .prop("currency", S.string())
    .prop("transactionRef", S.string())
    .prop("status", S.enum(PAYMENT_STATUS))
    .prop("createdAt", S.string().format("date-time"))
    .prop("paidAt", S.anyOf([S.string().format("date-time"), S.null()]))

const orderResponse = S.object()
    .prop("id", S.string())
    .prop("tickets", S.array().items(orderTickets))
    .prop("merch", S.array().items(orderMerch))
    .prop("status", S.enum(ORDER_STATUS))
    .prop("totalAmmount", S.number())
    .prop("createdAt", S.string().format("date-time"))
    .prop("updatedAt", S.anyOf([S.string().format("date-time"), S.null()]))
    .prop("paymemt", S.anyOf([paymentSchema, S.null()]))

export const ORDERS_PER_PAGE = 10

const orderList: FastifySchema = {
    querystring: paginationSchema(ORDERS_PER_PAGE),
    response: {
        200: S.array().items(orderResponse)
    }
}

export const dashboardOrderSchemas = {
    orderList
}
