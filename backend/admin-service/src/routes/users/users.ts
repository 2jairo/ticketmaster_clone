import bcrypt from 'bcrypt'
import { FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { Pagination } from 'types/pagination'
import { RouteCommonOptions } from 'types/routesCommon'
import { dashboardUserSchemas, updateUserBody } from './schema'

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
            users.map((u) => u.populateFollowing(0))
        )
        reply.status(200).send(resp)
    }

    fastify.route({
        method: 'POST',
        url: `${options.prefix}/:username`,
        schema: dashboardUserSchemas.updateUser,
        onRequest: [fastify.authenticate({ role: 'ROOT' })],
        handler: updateUser
    })
    async function updateUser(
        req: FastifyRequest<{ Params: { username: string }, Body: updateUserBody }>,
        reply: FastifyReply
    ) {
        const { username } = req.params

        if(req.body.password) {
            const hashRounds = parseInt(process.env.BCRYPT_HASH_RONUDS!) || 10
            const hashedPassword = await bcrypt.hash(req.body.password, hashRounds)
            req.body.password = hashedPassword
        }

        const user = await fastify.prismaW.user.update({
            where: { username },
            data: req.body
        })

        const resp = await user.populateFollowing(0)
        reply.status(200).send(resp)
    }

    fastify.route({
        method: 'DELETE',
        url: `${options.prefix}/:username`,
        onRequest: [fastify.authenticate({ role: 'ROOT' })],
        handler: deleteUser
    })
    async function deleteUser(req: FastifyRequest<{ Params: { username: string } }>, reply: FastifyReply) {
        const { username } = req.params
        
        await fastify.prismaW.user.delete({
            where: { username }
        })
        reply.status(204).send()
    }
})