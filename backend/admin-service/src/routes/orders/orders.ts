import { FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { Pagination } from 'types/pagination'
import { RouteCommonOptions } from 'types/routesCommon'
import { ADMIN_ROOT } from 'schemas/user'
import { dashboardOrderSchemas } from './schema'

export const dashboardOrderRoutes = fp((fastify, options: RouteCommonOptions) => {
    fastify.route({
        method: 'GET',
        url: `${options.prefix}`,
        schema: dashboardOrderSchemas.orderList,
        onRequest: [fastify.authenticate({})],
        handler: getOrderList
    })
    async function getOrderList(req: FastifyRequest<{ Querystring: Pagination }>, reply: FastifyReply) {
        const orders = await fastify.prismaW.order.findMany({
            where: {
                userId: req.user.userId,
            },
            skip: req.query.offset,
            take: req.query.size,
            include: {
                paymemt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        const populated = await Promise.all(orders.map(o => o.withPopulatedFields()))

        reply.status(200).send(populated)
    }
})
