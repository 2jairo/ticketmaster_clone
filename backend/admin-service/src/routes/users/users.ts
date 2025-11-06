import { FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { Pagination } from 'types/pagination'
import { RouteCommonOptions } from 'types/routesCommon'
import { dashboardUserSchemas } from './schema'

export const dashboardUserRoutes = fp((fastify, options: RouteCommonOptions) => {
    fastify.route({
        method: 'GET',
        url: `${options.prefix}`,
        schema: dashboardUserSchemas.userList,
        onRequest: [fastify.authenticate({ role: 'ROOT' })],
        handler: getUserList
    })
    async function getUserList(req: FastifyRequest<{ Querystring: Pagination }>, reply: FastifyReply) {
        const users = await fastify.prismaW.user.findMany({
            skip: req.query.offset,
            take: req.query.size
        })

        const resp = await Promise.all(
            users.map((u) => u.toRootResponse())
        )
        reply.status(200).send(resp)
    }
})